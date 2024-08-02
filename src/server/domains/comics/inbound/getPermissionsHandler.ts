import { NextApiHandler } from "next";
import { isAuthor } from "../middleware/isAuthor";
import { withAuth } from "@domains/users/middleware/withAuth";
import { acceptGetOnly } from "@domains/methodGatekeeper";

const getPermissionsHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res);
  return res.status(200).json({ edit: true })
};

export default withAuth(isAuthor(getPermissionsHandler));