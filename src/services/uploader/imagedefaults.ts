import path from "path"
import formidable from "formidable"
import {createHash, createRandom} from '../auth/server/hash'

const defaultImageUploadOptions: formidable.Options = {
  maxFileSize: 1 * 1024 * 1024,
  filter: ({ originalFilename, mimetype }: formidable.Part): boolean => {
    if (originalFilename && mimetype) {
      const fileExt = path.extname(originalFilename);
      const imageTypes = ["jpg", "jpeg", "gif", "tiff", "png"]; 
      // file extension matches mimetype 
      return imageTypes.includes(fileExt) && !!mimetype && mimetype.includes("image");
    }
    return false;
  },
  uploadDir: path.join(process.cwd(), "/public/uploads"),
  filename: (_name, _ext, path, _form) => {
    const imageHash = createHash(createRandom())
    const fileExt = path.originalFilename?.split(".")[1]
    return `${Date.now().toString()}_${imageHash}.${fileExt}`
  }
}

export default defaultImageUploadOptions