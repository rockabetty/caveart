import {
  hashEmail,
  hashPassword,
  compareHash,
  createRandom,
} from "@services/encryption/hash";
import { createUserSessionCookie } from "../outbound/userSessionCookie";
import {
  createUser,
  getUserCredentials,
  getPasswordResetCredentials,
  clearUserSession,
  getUser,
  editUser,
} from "../outbound/userRepository";
import jwt from "jsonwebtoken";
import { requireEnvVar } from "../../../services/logger/envcheck";
import { ErrorKeys } from "../errors.types";
import logger from "../../../services/logger";
import { User, UserCredentials } from "../user.types";
import { encrypt, decrypt } from "@services/encryption";
import { sendSingleEmail } from "../../../services/emailer";

const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");
console.log("User SErvice SKJ:" + SECRET_KEY_JWT)

export const registerUser = async (
  password: string,
  name: string,
  email: string,
) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: ErrorKeys.EMAIL_INVALID,
    };
  }

  const validUsername = /^[a-zA-Z0-9_-]+$/;
  if (!validUsername.test(name)) {
    return {
      success: false,
      error: ErrorKeys.USERNAME_INVALID,
    };
  }
  const encryptedEmail = encrypt(email);
  const hashedEmail = await hashEmail(email);
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedEmail,
      hashedPassword,
    );

    if (newUser) {
      return {
        success: true,
        data: newUser,
      };
    }
  } catch (error: any) {
    let errorKey = ErrorKeys.GENERAL_SERVER_ERROR;
    if (error.message.includes("email")) {
      errorKey = ErrorKeys.EMAIL_TAKEN;
    }
    if (error.message.includes("username")) {
      errorKey = ErrorKeys.USERNAME_TAKEN;
    }
    return {
      success: false,
      error: errorKey,
    };
  }
  return {
    success: false,
    error: ErrorKeys.GENERAL_SERVER_ERROR,
  };
};

export const resetPassword = async (
  newPassword: string,
  resetToken: string,
  email: string,
) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: ErrorKeys.EMAIL_INVALID,
    };
  }

  const hashedEmail = hashEmail(email);

  try {
    const userCredentials = await getPasswordResetCredentials(
      "hashed_email",
      hashedEmail,
    );
    const { id, password_reset_token, password_reset_expiry } = userCredentials;
    if (!password_reset_expiry || !password_reset_token || !id) {
      throw new Error(ErrorKeys.CREDENTIALS_INVALID);
    }

    const storedResetToken = password_reset_token;
    const expirationTimestamp = password_reset_expiry;
    if (storedResetToken) {
      const isMatch = storedResetToken === resetToken;
      const expirationDate = new Date(expirationTimestamp);
      const currentDate = new Date();
      const isStillValid = currentDate < expirationDate;
      if (!isStillValid) {
        logger.log(ErrorKeys.RESET_TOKEN_EXPIRED);
        const removePasswordResetToken = {
          password_reset_token: null,
          password_reset_expiry: null,
        };
        await editUser(id, removePasswordResetToken);
        return {
          success: false,
          error: ErrorKeys.RESET_TOKEN_EXPIRED,
        };
      }
      if (isMatch) {
        const password = await hashPassword(newPassword);
        const updatePassword = {
          password_reset_token: null,
          password_reset_expiry: null,
          password,
        };
        await editUser(id, updatePassword);
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: ErrorKeys.CREDENTIALS_INVALID,
      };
    }
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
};

export const offerPasswordReset = async (requestEmail:string) => {
  const sanitizedEmail = requestEmail.replace(/[^a-zA-Z0-9@._-]/gi, "");
  const hashedEmail = hashEmail(sanitizedEmail);

  try {
    const userCredentials: UserCredentials | null = await getUserCredentials(
      "hashed_email",
      hashedEmail,
    );

    if (!userCredentials) {
      logger.log(ErrorKeys.CREDENTIALS_MISSING);
      return {
        // We'll do the "if this email exists...", want to avoid making enumeration easier
        success: true,
      };
    }

    const { id, email } = userCredentials;

    if (!id || !email) {
      // Pretending all is good still to not assist enumeration attacks
      logger.log(ErrorKeys.EMAIL_INVALID);
      return {
        success: true,
      };
    }

    const resetToken = await createRandom();
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + threeDaysInMilliseconds);

    const update = {
      password_reset_token: resetToken,
      password_reset_expiry: expirationDate,
    };

    await editUser(id, update);
    const decryptedEmail = decrypt(email);
    await sendSingleEmail(
      decryptedEmail,
      "Password Reset",
      `
      <p>Hello!</p>
      <p>You are receiving this email because of an attempt to reset your password.</p>
      <p>
        <a href="https://www.caveartwebcomics.com/auth/password/${resetToken}">
          Click here to reset your password.
        </a>
        If you did not request this password reset then please ignore this email or contact us at ${requireEnvVar(
          "SUPPORT_EMAIL_ADDRESS",
        )} to report this email.
      </p>
      `,
    );

    return {
      success: true,
    };
  } catch (error:any) {
    logger.error(error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
};

export const loginUser = async (email:string, password:string) => {
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, "");
  const hashedEmail = hashEmail(sanitizedEmail);

  try {
    const userCredentials = await getUserCredentials(
      "hashed_email",
      hashedEmail,
    );
    if (!userCredentials || !userCredentials.id) {
      logger.log("loginUser - invalid user credentials");
      return { success: false };
    }
    const storedPassword = userCredentials.password;
    if (storedPassword) {
      const isMatch = await compareHash(password, storedPassword);
      if (isMatch) {
        const idString = userCredentials.id.toString();
        const sessionCookie = await createUserSessionCookie(idString);
        return {
          success: true,
          userId: userCredentials.id,
          username: userCredentials.username,
          sessionCookie,
        };
      }
    }
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
  return { success: false };
};

export const logoutUser = async (token: string) => {
  try {
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY_JWT) as { sub: string };
    } catch (error: any) {
      logger.error(error);
      return {
        success: false,
        error: ErrorKeys.TOKEN_INVALID,
      };
    }

    const userId = decoded.sub;
    const sessionCleared = await clearUserSession(userId, token);

    if (!sessionCleared) {
      logger.error(new Error(`logoutUser: Session for user ${userId} was not cleared.`));
      return {
        success: false,
        error: ErrorKeys.SESSION_MISSING,
      };
    }

    return {
      success: true,
      user: userId,
    };
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
};

export const getUserProfile = async (token:string) => {
  const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT) as {
    sub: string;
  } | null;
  if (!decodedRequestToken) {
    return {
      success: false,
      error: ErrorKeys.TOKEN_INVALID,
    };
  }
  const userId = parseInt(decodedRequestToken.sub);
  if (!userId) {
    logger.log(
      `getUserProfile: Request token yields invalid user ID [${userId}]`,
    );
    return {
      success: false,
      error: ErrorKeys.USER_INVALID,
    };
  }

  const userProfileDetails = ["username", "email", "role", "created_at"];

  try {
    const userProfile: User | null = await getUser(userId, userProfileDetails);
    if (!userProfile) {
      logger.log(
        `Login attempt with invalid user ID - not found in database [${userId}]`,
      );
      return {
        success: false,
        error: ErrorKeys.USER_INVALID,
      };
    }

    const { email } = userProfile;
    const decryptedEmail = email && decrypt(email);
    userProfile.email = decryptedEmail;

    return {
      success: true,
      data: userProfile,
    };
  } catch (error) {
    logger.error(new Error("getUserProfile: unanticipated error occured"));
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
};
