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
  console.log("*********************Parse Form Beginning******************")
  // Ensure the upload directory exists
  await fs.ensureDir(uploadDir);
  
  console.log("Upload directory ensured:", uploadDir);

  // Configure formidable
  // const form = formidable({
  //   uploadDir,
  //   keepExtensions: true,
  //   maxFileSize: 5 * 1024 * 1024, // 5MB file size limit, adjust as needed
  //   filter: ({ name, originalFilename, mimetype }) => {
  //     // This will only accept image files
  //     if (mimetype && mimetype.startsWith('image/')) {
  //       return true;
  //     }
  //     return false;
  //   },
  // });
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });


  // Debugging event listeners
  form.on('fileBegin', (name, file) => {
    console.log(`Starting upload of ${name}: ${file.originalFilename}`);
  });

  form.on('progress', (bytesReceived, bytesExpected) => {
    console.log(`Progress: ${bytesReceived} / ${bytesExpected}`);
  });

  form.on('error', (err) => {
    console.log('Formidable error:', err);
  });

  form.on('end', () => {
    console.log('Formidable parsing finished.');
  });

  // Parse the form
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    console.log("Calling form.parse.");
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log("Error in parsing.")
        logger.error(err);
        reject(err);
        return;
      }
      console.log("Resolving time.");
      resolve({ fields, files });
    });
  });
};
