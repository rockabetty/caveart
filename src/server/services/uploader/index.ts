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
import { requireEnvVar } from '@logger/envcheck';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param {string} fileName - The name of the file to upload.
 * @param {string} fileType - The MIME type of the file.
 * @param {string} prefix - The prefix (folder path) for storing the file in S3.
 * @param {number} expiresIn - Optional expiration time for the pre-signed URL (default is 60 seconds).
 * @returns {Promise<{ uploadUrl: string, fileUrl: string }>}
 */
export const getPresignedUrl = async (
  fileName: string,
  fileType: string, 
  prefix: string,
  expiresIn: number = 60
) => {
  const region = requireEnvVar('AWS_REGION');
  const bucket = requireEnvVar('AWS_S3_BUCKET_USA');
  const s3Client = new S3Client({ 
    region,
    credentials: {
      accessKeyId: requireEnvVar('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: requireEnvVar('AWS_S3_SECRET_ACCESS_KEY')
    }
  });

  try {
    if (!fileName || !fileType) {
      return {
        success: false,
        error: "Invalid or missing file"
      }
    }
    const objectKey = `${prefix}/${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: fileType,
      ACL: 'public-read',
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`;
    return {
      success: true,
      data: { uploadUrl, fileUrl }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
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

   const formImageDefaults = (() => {
    switch (purpose) {
      case "thumbnail":
        return tinyImageDefaults;
      case "small":
        return smallImageDefaults;
      case "large":
        return largeImageDefaults;
      default:
        return imageDefaults;
    }
  })();

  const form = formidable(formImageDefaults);

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