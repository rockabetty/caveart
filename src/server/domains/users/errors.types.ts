export enum ErrorKeys {
  USERNAME_MISSING = "server.users.errors.usernameMissing",
  USERNAME_TAKEN = "server.users.errors.userNameTaken",
  USERNAME_INVALID = "server.users.errors.userNameInvalid",
  EMAIL_INVALID = "server.users.errors.emailInvalid",
  EMAIL_TAKEN = "server.users.errors.emailTaken",
  EMAIL_MISSING = "server.users.errors.emailMissing",
  PASSWORD_MISSING = "server.users.errors.passwordMissing",
  PASSWORD_SHORT = "server.users.errors.passwordTooShort",
  PASSWORD_MISMATCH = "server.users.errors.passwordsDontMatch",
  CREDENTIALS_MISSING = "server.users.errors.credentialsMissing",
  CREDENTIALS_INVALID = "server.users.errors.credentialsInvalid",
  GENERAL_SUBMISSION_ERROR = "server.users.errors.generalSubmissionError",
  TOKEN_MISSING = "server.users.errors.tokenMissing",
  TOKEN_INVALID = "server.users.errors.tokenInvalid",
  SESSION_MISSING = "server.users.errors.sessionMissing",
  SESSION_INVALID = "server.users.errors.sessionInvalid",
  GENERAL_SERVER_ERROR = "server.users.errors.serverError",
  RESET_TOKEN_MISSING = "server.users.errors.resetTokenMissing",
  RESET_TOKEN_EXPIRED = "server.users.errors.resetTokenExpired",
  USER_INVALID = "server.users.errors.userInvalid"
}

export class ClientError extends Error {
  code?: string;
  constraint?: string;

  constructor(message: string, code?: string, constraint?: string) {
    super(message);
    this.name = 'ClientError';
    this.code = code;
    this.constraint = constraint;
  }
}