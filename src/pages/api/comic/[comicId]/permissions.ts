import { NextApiRequest, NextApiResponse } from "next";
import { isAuthor } from "@data/comics";
import jwt from "jsonwebtoken";
import { requireEnvVar } from "../../../../services/logs/envcheck";
import { ErrorKeys } from "../../../../server/domains/users/errors.types";

const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");
const USER_AUTH_TOKEN_NAME = requireEnvVar('NEXT_PUBLIC_USER_AUTH_TOKEN_NAME')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { comicId } = req.query;

  if (req.method === "GET") {
    const comic = parseInt(comicId);
    if (isNaN(comic)) {
      return res.status(400).json({ message: "Invalid comic ID" });
    }

    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      return res.status(500).json(ErrorKeys.TOKEN_MISSING);
    }
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT) as {
      sub: string;
    } | null;
    if (!decodedRequestToken) {
      return res.status(500).json(ErrorKeys.TOKEN_INVALID);
    }
    const userId = parseInt(decodedRequestToken.sub);
    if (!userId) {
      return res.status(403).json(ErrorKeys.USER_INVALID);
    }

    try {
      const canEdit = await isAuthor(userId, comic);
      const permissions = {
        edit: canEdit,
      };
      return res.status(200).json(permissions);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error while checking permissions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
