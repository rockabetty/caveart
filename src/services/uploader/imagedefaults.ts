import path from "path";
import formidable from "formidable";
import { createHash, createRandom } from '@services/encryption/hash';

const defaultImageUploadOptions: formidable.Options = {
  maxFileSize: 2000 * 1024, // 2000 KB
  maxTotalFileSize: 2000 * 1024, // 2000 KB
  filter: ({ originalFilename, mimetype }: formidable.Part): boolean => {
    if (originalFilename && mimetype) {
      const fileExt = path.extname(originalFilename).toLowerCase().substring(1);
      const imageTypes = ["jpg", "jpeg", "gif", "tiff", "png"];
      // file extension matches mimetype 
      return imageTypes.includes(fileExt) && mimetype.startsWith("image/");
    }
    return false;
  },
  uploadDir: path.join(process.cwd(), "public", "uploads"),
  filename: (_name, _ext, part, _form) => {
    const imageHash = createHash(createRandom());
    const fileExt = part.originalFilename?.split(".").pop();
    return `${Date.now().toString()}_${imageHash}.${fileExt}`;
  }
};

export default defaultImageUploadOptions;