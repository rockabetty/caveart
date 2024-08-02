import { NextApiHandler } from "next";
import updateThumbnailHandler, {
    config,
} from "@domains/comics/inbound/updateThumbnailHandler";

export { config };

const handler: NextApiHandler = (req, res) => {
    return updateThumbnailHandler(req, res);
};

export default handler;
