import fs from "fs-extra";
import logger from "@logger";
import { requireEnvVar } from "@logger/envcheck";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = requireEnvVar("AWS_REGION");
const bucket = requireEnvVar("AWS_S3_BUCKET_USA");
const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`;

let s3Client: S3Client;

const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: requireEnvVar("AWS_S3_ACCESS_KEY_ID"),
        secretAccessKey: requireEnvVar("AWS_S3_SECRET_ACCESS_KEY"),
      },
    });
  }
  return s3Client;
};


type PresignedUrlResponse = {
  success: boolean;
  data?: { uploadUrl: string; fileUrl: string };
  error?: string;
};

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
  expiresIn: number = 60,
): Promise<PresignedUrlResponse> => {
  const client = getS3Client();
 
  try {
    if (!fileName || !fileType) {
      return {
        success: false,
        error: "Invalid or missing file",
      };
    }
    const objectKey = `${prefix}/${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn });
    const fileUrl = `${baseUrl}/${objectKey}`;
    return {
      success: true,
      data: { uploadUrl, fileUrl },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
};

/**
 * Deletes an object from S3.
 * @param {string} url - The full URL of the file to delete in the S3 bucket, e.g.  https://my-custom-bucket.s3.us-region-x.amazonaws.com/uploads/comics/public/1/thumbnails/1731703853633_thumbnail.png
 * @returns {Promise<{ success: boolean; error?: string }>} - Returns an object indicating the success of the operation.
 * - `success: true` if the object was deleted successfully.
 * - `error: string` contains the error message if the deletion failed.
 */
export const deleteFromS3 = async (url: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = getS3Client();
    const parsedUrl = new URL(url);
    const key = parsedUrl.pathname.slice(1); 
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await client.send(command);
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Unknown error"
    }
  }
};


