import { CORE_ERROR_MAP } from './errorMap';
import { COMIC_PAGE_ERROR_MAP } from '../domains/comicpages/errorMap';
import { ApplicationErrorKey, ApiErrorResponse } from '../apiResponse.types';
import {t} from 'i18next';

export const APPLICATION_ERROR_MAP: Record<ApplicationErrorKey, { message: string, statusCode: number }> = {
  ...COMIC_PAGE_ERROR_MAP,
  ...CORE_ERROR_MAP
};

/**
 * Retrieves error information for the given error key.
 * 
 * @param {ApplicationErrorKey} errorKey - The key identifying the type of error
 * @returns {Object} An object containing the error message and HTTP status code
 * @returns {string} returns.message - Human-readable error message
 * @returns {number} returns.statusCode - HTTP status code for the error
 */
export function getErrorInfo(errorKey: ApplicationErrorKey) {
  return APPLICATION_ERROR_MAP[errorKey] || {
    message: "I don't know what happened, dawg",
    statusCode: 500
  };
}

/**
 * Standard handler for unknown errors encountered during database operations.
 * Logs the error and throws a standardized error.
 * @returns never - This function always throws
 */
export function handleUnknownError(): never {
  const unknownError = new Error("An unexpected error occured, good luck homie");
  logger.error("Unknown error encountered", { unknownError });
  throw unknownError;
}

/**
 * Standard error handler for database operations.
 * If the error is an instance of Error, it logs and rethrows it.
 * Otherwise, it calls handleUnknownError.
 * 
 * @param error The error to handle
 * @param context Optional context information to include in the log
 * @returns never - This function always throws
 */
export function handleDatabaseError(error: unknown, context?: object): never {
  if (error instanceof Error) {
    logger.error("Database operation error", { error, ...context });
    throw error;
  } else {
    return handleUnknownError();
  }
}

/**
 * Sends an error response to the client with the appropriate status code and error details.
 * 
 * @param {NextApiResponse} res - The Next.js response object
 * @param {ApplicationErrorKey} errorKey - The key identifying the type of error
 * @param {any} [details] - Optional additional details about the error
 * @returns {void} The function sends the response and doesn't return a value
 * 
 * @example
 * // Send a "resource not found" error
 * sendErrorResponse(res, ErrorKeys.RESOURCE_NOT_FOUND);
 * 
 * // Send a validation error with details
 * sendErrorResponse(res, ErrorKeys.VALIDATION_ERROR, { 
 *   field: "email", 
 *   issue: "Format is invalid" 
 * });
 */
export function sendErrorResponse(res: NextApiResponse, errorKey, details?: any) {
  const errorInfo = getErrorInfo(errorKey);
  return res.status(errorInfo.statusCode).json(errorResponse(errorKey, details));
}

export function errorResponse(
  code: ApplicationErrorKey,
  details?: any,
  endpoint?: string
): ApiErrorResponse {
  const errorInfo = getErrorInfo(code);
  
  return {
    success: false,
    error: {
      code,
      message: t(code, { defaultValue: errorInfo.message }),
      details,
      endpoint
    }
  };
}