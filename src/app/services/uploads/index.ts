import axios, { AxiosProgressEvent, AxiosError } from "axios";

type UploadType = "comic page" | "thumbnail";

interface PresignedData {
  uploadUrl: string;
  fileUrl: string;
}

interface UploadOptions {
  tenant: string;
  presignFor?: UploadType;
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxRetries?: number;
  retryDelay?: number;
}

class S3UploadError extends Error {
  constructor(
    message: string,
    public readonly stage: 'presign' | 'upload',
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'S3UploadError';
  }
}

const getPresignEndpoint = (tenant: string, type: UploadType): string => {
  const endpoints = {
    "comic page": `/api/comic/${tenant}/pages/presign`,
    "thumbnail": `/api/comic/${tenant}/presign-thumbnail`
  };
  return endpoints[type];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadToS3 = async (
  file: File,
  {
    tenant,
    presignFor = "comic page",
    onProgress,
    maxRetries = 3,
    retryDelay = 1000
  }: UploadOptions
): Promise<string> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      // Get presigned URL
      const presignedData = await getPresignedUrl(file, tenant, presignFor);
      
      // Attempt upload
      return await performUpload(file, presignedData, onProgress);

    } catch (error) {
      attempts++;
      
      if (error instanceof S3UploadError) {
        // If it's the last attempt, rethrow
        if (attempts === maxRetries) throw error;
        
        // Wait before retrying
        await delay(retryDelay * attempts); // Exponential backoff
        continue;
      }
      
      // For unknown errors, rethrow immediately
      throw error;
    }
  }

  throw new Error("Maximum retry attempts reached");
};

async function getPresignedUrl(
  file: File,
  tenant: string,
  presignFor: UploadType
): Promise<PresignedData> {
  try {
    const { name, type } = file;
    const endpoint = getPresignEndpoint(tenant, presignFor);
    
    const { data } = await axios.post<PresignedData>(
      endpoint,
      { name, type, tenant },
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    if (!data.uploadUrl || !data.fileUrl) {
      throw new S3UploadError(
        "Invalid presigned URL response",
        'presign'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new S3UploadError(
        `Failed to obtain pre-signed URL: ${error.message}`,
        'presign',
        error
      );
    }
    throw error;
  }
}

async function performUpload(
  file: File,
  { uploadUrl, fileUrl }: PresignedData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<string> {
  try {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
      onUploadProgress: onProgress,
    });

    return fileUrl;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new S3UploadError(
        `Failed to upload file: ${error.message}`,
        'upload',
        error
      );
    }
    throw error;
  }
}