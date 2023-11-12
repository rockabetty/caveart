import { NextApiHandler } from "next"
import {createHash, createRandom} from "../auth/server/hash";

import formidable from "formidable"
import path from "path"
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false,
  },
}

const readFile = (req: NextApiRequest, saveLocally?: boolean)
:Promise<{fields?: formidable.Fields; files?: formidable.Files}> => {
  const options: formidable.Options = {}
  if (saveLocally) {
    options.maxFileSize = 1 * 1024 * 1024
    options.filter = ({ name, originalFilename, mimetype }) => {
      const fileExt = originalFilename.split(".")[1]
      const imageTypes = ["jpg", "jpeg", "gif", "tiff", "png"]
      // file extension matches mimetype 
      return imageTypes.includes(fileExt) && mimetype && mimetype.includes("image");
    }
    options.uploadDir = path.join(process.cwd(), "/public/uploads")
    options.filename = (name, ext, path, form) => {
      const imageHash = createHash(createRandom())
      const fileExt = path.originalFilename.split(".")[1]
      console.log(fileExt)
      return `${Date.now().toString()}_${imageHash}.${fileExt}`
    }
  }
  const form = formidable(options)

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({fields, files})  
    })
  })
}

export const deleteFile = async (filename: string) => {
  const filePath = path.join(process.cwd(), '/public/uploads', filename);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default deleteFile;

const handler: NextApiHandler = async (req, res) => {
    try {
      await fs.readdir(path.join(process.cwd() + "/public/uploads"))
    } catch (error) {
      await fs.mkdir(path.join(process.cwd() + "/public/uploads"))
    }
    const result = await readFile(req, true)
    if (result.files) {
      const {newFilename} = result.files.image
      res.status(200).send({ image: newFilename })
    } else {
      // TODO: more detailed error messages for different failure scenarios
      // (e.g., file too large, wrong file type, etc.).
      res.status(400).send()
    }
};

export default handler