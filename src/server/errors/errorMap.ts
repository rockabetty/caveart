import { ErrorKeys } from '../errors.types';

interface ErrorInfo {
  message: string;
  statusCode: number;
}

export const CORE_ERROR_MAP: Record<ErrorKeys, ErrorInfo> = {
  [ErrorKeys.GENERAL_SERVER_ERROR]: {
    message: "I don't know what happened, dawg.",
    statusCode: 500
  },
  [ErrorKeys.USER_NOT_AUTHORIZED]: {
    message: "I'm afraid I can't let you do that, dave",
    statusCode: 403
  },
   [ErrorKeys.INVALID_REQUEST]: {
    message: "There's some issue with your request, look it over.",
    statusCode: 400
  },
  [ErrorKeys.RESOURCE_NOT_FOUND]: {
    message: "Whatever you are trying to access doesn't appear to exist.",
    statusCode: 404
  },
  [ErrorKeys.RATE_LIMIT_EXCEEDED]: {
    message: "Slow down, brochacho! Do you need to drink some water?",
    statusCode: 429
  },
  [ErrorKeys.UNSUPPORTED_MEDIA_TYPE]: {
    message: "The file type you just sent is not a supported type.",
    statusCode: 415
  },
  [ErrorKeys.VALIDATION_ERROR]: {
    message: "Your request couldn't be validated.",
    statusCode: 400
  },
  [ErrorKeys.AUTHENTICATION_FAILED]: {
    message: "You don't have permission.  Are you sure you're authorized?",
    statusCode: 401
  },
}