import path from "path";
import formidable from "formidable";
import { createHash, createRandom } from "@services/encryption/hash";

export const getUploadDirectory = (): string => {
  // We will fix this up to involve S3 buckets or whatever when we're a REAL BOY
  return path.join(process.cwd(), 'public', 'uploads');
};

const uploadDir = getUploadDirectory();

export const imageDefaults: formidable.Options = {
  maxFileSize: 2000 * 1024, // 2000 KB
  maxTotalFileSize: 3000 * 1024, // 3000 KB
  filter: ({ originalFilename, mimetype }: formidable.Part): boolean => {
    if (originalFilename && mimetype) {
      const fileExt = path.extname(originalFilename).toLowerCase().substring(1);
      const imageTypes = ["jpg", "jpeg", "gif", "tiff", "png", "ico", "svg"];
      // file extension matches mimetype
      return imageTypes.includes(fileExt) && (
        mimetype.startsWith("image/") || mimetype === "image/x-icon" || mimetype === "image/svg+xml"
      );
    }
    return false;
  },
  uploadDir,
  filename: (_name, _ext, part, _form) => {
    const imageHash = createHash(createRandom());
    const fileExt = part.originalFilename?.split(".").pop();
    return `${Date.now().toString()}_${imageHash}.${fileExt}`;
  },
};

export const largeImageDefaults = {
  ...imageDefaults,
  maxFileSize: 3000 * 1024,
  maxTotalFileSize: 25000 * 1024,
};

export const smallImageDefaults = {
  ...imageDefaults,
  maxFileSize: 200 * 1024,
  maxTotalFileSize: 200 * 1024
}

export const tinyImageDefaults = {
  ...imageDefaults,
  maxFileSize: 100 * 1024,
  maxTotalFileSize: 100 * 1024
}

export default imageDefaults;
