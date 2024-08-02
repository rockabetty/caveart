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
import {
  queryDbConnection,
} from "../../sql-helpers/queryFunctions";

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = getUploadDirectory();

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

export const parseFormWithSingleImage = async (req: NextApiRequest, purpose: string) => {
  await fs.ensureDir(uploadDir);

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};


export async function addComicImageToDatabase(
  src: string,
): Promise<number | null> {
  const query = `
    INSERT INTO comic_image_uploads
    (img)
    VALUES
    ($1)
    RETURNING id
  `;
  const values = [src];
  try {
    const result = await queryDbConnection(query, values);
    return Number(result.rows[0].id);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}