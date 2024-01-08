import {Fields, Files} from "formidable"

export type MultipartFormResultType = {
  fields?: Fields;
  files?: Files;
};