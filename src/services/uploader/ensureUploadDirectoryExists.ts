import path from "path";
import fs from "fs/promises";

const ensureUploadDirectoryExists = async function () {
  const uploadPath = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.readdir(uploadPath);
  } catch (error:any) {
    if (error.code === 'ENOENT') {
      try {
        await fs.mkdir(uploadPath, { recursive: true });
      } catch (mkdirError) {
        console.error("Failed to create upload directory:", mkdirError);
      }
    } else {
      console.error("Error reading upload directory:", error);
    }
  }
};

export default ensureUploadDirectoryExists;