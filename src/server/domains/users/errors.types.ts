export enum ErrorKeys {
  USERNAME_MISSING = "authenticationForm.instructions.username",
  USERNAME_TAKEN = "authenticationForm.userErrorMessages.userNameTaken",
  USERNAME_INVALID = "authenticationForm.userErrorMessages.userNameInvalid",
  EMAIL_INVALID = "authenticationForm.instructions.email",
  EMAIL_TAKEN = "authenticationForm.userErrorMessages.emailTaken",
  EMAIL_MISSING = "authenticationForm.userErrorMessages.emailMissing",
  PASSWORD_MISSING = "authenticationForm.userErrorMessages.passwordMissing",
  PASSWORD_SHORT = "authenticationForm.userErrorMessages.passwordTooShort",
  PASSWORD_MISMATCH = "authenticationForm.userErrorMessages.passwordsDontMatch",
  CREDENTIALS_MISSING = "authenticationService.requestErrorMessages.credentialsMissing",
  CREDENTIALS_INVALID = "authenticationForm.userErrorMessages.credentialsInvalid",
  GENERAL_SUBMISSION_ERROR = "authenticationForm.userErrorMessages.generalError",
  TOKEN_MISSING = "authenticationService.requestErrorMessages.tokenMissing",
  TOKEN_INVALID = "authenticationService.requestErrorMessages.tokenInvalid",
  SESSION_MISSING = "authenticationService.requestErrorMessages.sessionMissing",
  SESSION_INVALID = "authenticationService.requestErrorMessages.sessionInvalid",
  GENERAL_SERVER_ERROR = "authenticationService.requestErrorMessages.serverError",
  RESET_TOKEN_MISSING = "authenticationService.requestErrorMessages.resetTokenMissing",
  RESET_TOKEN_EXPIRED = "authenticationService.requestErrorMessages.resetTokenExpired",
  USER_INVALID = "authenticationService.requestErrorMessages.userInvalid"
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