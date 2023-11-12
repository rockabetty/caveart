import path from "path"
import fs from "fs/promises"

const ensureUploadDirectoryExists = async function () {
  try {
    await fs.readdir(path.join(process.cwd() + "/public/uploads"))
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public/uploads"))
  }
  // TODO:  adding error handling for the fs.mkdir operation, in case there 
  // are issues with permissions or other filesystem-related errors.
}

export default ensureUploadDirectoryExists;