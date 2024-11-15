import axios from "axios";

type UploadType = "comic page" | "thumbnail" | "avatar" | "site graphic";

export const uploadToS3 = async (
  file: File,
  tenant: string,
  preSignFor: UploadType = "comic page",
  onProgress?: (progressEvent: ProgressEvent) => void
): Promise<string> => {
  try {
    const { name, type } = file;
    const data = JSON.stringify({ name, type });

    let endpoint = `/api/comic/${tenant}/page/presign`;

    if (preSignFor !== "comic page") {
      if (presignFor === "avatar") endpoint = "/api/auth/presign";
      if (preSignFor === "thumbnail") endpoint = `/api/comic/${tenant}/page/presign-thumbnail`;
      if (preSignFor === "site graphic") endpoint = `/api/comic/${tenant}/assets/presign`;
    }

    const presignedUrlResponse = await axios.post(
      endpoint,
      data,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const { uploadUrl, fileUrl } = presignedUrlResponse.data;
    if (!uploadUrl || !fileUrl) {
      throw new Error("Failed to obtain pre-signed URL.");
    }

    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": type,
      },
      onUploadProgress: onProgress,
    });

    return fileUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("File upload failed.");
  }
};