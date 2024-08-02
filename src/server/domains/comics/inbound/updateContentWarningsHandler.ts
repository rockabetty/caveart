import { NextApiHandler } from "next";
import { updateContentWarnings } from "../core/comicService";
import { acceptPostOnly } from "@domains/methodGatekeeper";
import { ErrorKeys } from "../../../errors.types";

const updateContentWarningsHandler: NextApiHandler = async (
  req,
  res
) => {
  acceptPostOnly(req, res);
  const tenantID = Number(req.cookies['CAVEARTWBCMX_current-comic']);
  const { old, update, rating } = req.body;
  if (!rating) {
    return res.status(400).json({ error: ErrorKeys.INVALID_REQUEST });
  }

  try {
    const contentUpdate = await updateContentWarnings(tenantID, old, update, rating)
    if (contentUpdate.success) {
      return res.status(200).send("OK")
    }
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR })
  } catch (error) {
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR })
  }
}

export default updateContentWarningsHandler;