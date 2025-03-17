import { CORE_ERROR_MAP } from './errorMap';
import { COMIC_PAGE_ERROR_MAP } from '../domains/comicpages/errorMap';
import { ApplicationErrorKey, ApiErrorResponse } from '../apiResponse.types';
import {t} from 'i18next';

export const APPLICATION_ERROR_MAP: Record<ApplicationErrorKey, { message: string, statusCode: number }> = {
  ...COMIC_PAGE_ERROR_MAP,
  ...CORE_ERROR_MAP
};

export function getErrorInfo(errorKey: ApplicationErrorKey) {
  return APPLICATION_ERROR_MAP[errorKey] || {
    message: "I don't know what happened, dawg",
    statusCode: 500
  };
}

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