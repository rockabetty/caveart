import fs from "fs-extra";
import path from "path";
import { ImagePurpose } from "./images.types";
import imageDefaults, {
  tinyImageDefaults,
  smallImageDefaults,
  largeImageDefaults,
} from "./imagedefaults";
import formidable from "formidable";
import { NextApiRequest } from "next";
import logger from "@logger";

export const getUploadDirectory = (): string => {
  // We will fix this up to involve S3 buckets or whatever when we're a REAL BOY
  return path.join(process.cwd(), 'public', 'uploads');
};

export const deleteFile = async (filename: string) => {
  const filePath = path.join(process.cwd(), "/public/uploads", filename);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    logger.error(error);
    return false;
  }
};

export const parseForm = async (
  req: NextApiRequest,
  purpose: ImagePurpose,
):   Promise<{ fields: formidable.Fields, files: formidable.Files }> => {
  let options = imageDefaults;

  switch (purpose) {
    case "favicon":
      options = tinyImageDefaults;
      break;
    case "thumbnail":
      options = smallImageDefaults;
      break;
    case "illustration":
      options = largeImageDefaults;
      break;
    case "small":
      options = smallImageDefaults;
      break;
    default:
      break;
  }

  const directory = getUploadDirectory(); 
  await fs.ensureDir(directory);

  const form = new formidable.IncomingForm(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};
