import { ErrorKeys as CoreErrors } from './errors.types';
import { ErrorKeys as ComicPageErrors } from './domains/comicspages/errors.types';
import { ErrorKeys as ComicErrors } from '../domains/comics/errors.types';
import { ErrorKeys as UserErrors } from '../domains/users/errors.types';

export type ApplicationErrorKey = 
  | ComicPageErrors
  | ComicErrors 
  | UserErrors
  | CoreErrors;

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    timestamp?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApplicationErrorKey;
    message: string;
    details?: any;
    endpoint?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;