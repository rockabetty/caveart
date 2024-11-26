import axios, { AxiosProgressEvent } from "axios";

type UploadType = "comic page" | "thumbnail";

export const uploadToS3 = async (
  file: File,
  tenant: string,
  presignFor: UploadType = "comic page",
  onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<string> => {
  try {
    const { name, type } = file;
    const data = JSON.stringify({ name, type, tenant });

    let endpoint = `/api/comic/${tenant}/page/presign`;

    if (presignFor !== "comic page") {
      if (presignFor === "thumbnail") endpoint = `/api/comic/${tenant}/presign-thumbnail`;
      // add different endpoints here as needs expand
    }

    const presignedUrlResponse = await axios.post(
      endpoint,
      data,
      {
        headers: { 
          "Content-Type": "application/json",
         // "Origin": "http://localhost:3000",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );

    const { uploadUrl, fileUrl } = presignedUrlResponse.data;
    if (!uploadUrl || !fileUrl) {
      throw new Error("Failed to obtain pre-signed URL.");
    }

    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": type,
     //   "Origin": "http://localhost:3000",
        "Access-Control-Allow-Origin": "*",
      },
      onUploadProgress: onProgress,
    });

    return fileUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("File upload failed.");
  }
};

