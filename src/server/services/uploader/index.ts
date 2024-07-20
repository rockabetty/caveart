import fs from "fs-extra";
import path from "path";
import { ImagePurpose } from "./images.types";
import imageDefaults, {
  getUploadDirectory,
  tinyImageDefaults,
  smallImageDefaults,
  largeImageDefaults,
} from "./imagedefaults";
import formidable from "formidable";
import { NextApiRequest } from "next";
import logger from "@logger";

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
):   Promise<{ fields?: formidable.Fields, files?: formidable.Files }> => {
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

  try {
    await fs.access(directory, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    logger.warn(`Directory ${directory} is not accessible. Setting permissions...`);
    await fs.chmod(directory, 0o755); // Owner can read/write/execute, others can read/execute
  }
 
  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({fields, files})  
    })
  })

};
