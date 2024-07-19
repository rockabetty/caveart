import { NextApiHandler } from "next";
import { isAuthor } from "../comicService";
import { requireEnvVar } from "@logger/envcheck";
import { ErrorKeys as UserErrorKeys } from "../../users/errors.types";
import { ErrorKeys } from "../errors.types";
import { withAuth } from "../../users/middleware";
const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");
const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");

const getComicPermissionsHandler: NextApiHandler = async (req, res) => {
  const { comicId } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end();
  }

  const comic = parseInt(comicId);
  if (isNaN(comic)) {
    return res.status(400).json({ message: "Invalid comic ID" });
  }

  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  if (!token) {
    return res.status(400).json(UserErrorKeys.TOKEN_MISSING);
  }

  try {
    const permissions = await isAuthor(token, comic);
    if (permissions.success) {
        return res.status(200).json({ edit: permissions.edit });
    }
  } catch (error: any) {
    return res.status(500).json(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(getUserComicPermissionHandler);
