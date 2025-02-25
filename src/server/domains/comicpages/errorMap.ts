import { ErrorKeys } from './errors.types';

interface ErrorInfo {
  message: string;
  statusCode: number;
}

export const COMIC_PAGE_ERROR_MAP: Record<ErrorKeys, ErrorInfo> = {
  [ErrorKeys.IMAGE_MISSING]: {
    message: "Please supply an image file.",
    statusCode: 400
  },
  [ErrorKeys.COMIC_MISSING]: {
    message: "This comic does not exist.",
    statusCode: 404
  },
   [ErrorKeys.COMIC_PAGE_MISSING]: {
    message: "This comic page does not exist.",
    statusCode: 404
  },
  [ErrorKeys.COMIC_INVALID]: {
    message: "This comic exists but you can't do that.",
    statusCode: 403
  },
  [ErrorKeys.PAGE_NUMBER_MISSING]: {
    message: "I need to know which comic page number you're talking about.",
    statusCode: 400
  },
  [ErrorKeys.ERROR_CREATING_COMPRESSION_TASK]: {
    message: "Your image was not successfully compressed for thumbnails and slow connections.",
    statusCode: 503
  }
}