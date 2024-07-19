import {Fields, Files} from "formidable"

export type MultipartFormResultType = {
  fields?: Fields;
  files?: Files;
};

export interface SubmissionResult {
  fields?: formidable.Fields;
  files?: formidable.Files;
}