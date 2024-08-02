import { NextApiHandler } from "next";
import cookie from "cookie";
import { getComicProfile } from "@domains/comics/core/comicService";
import { isValidSubdomain } from "@domains/comics/core/comicService";
import logger from "../../../../server/services/logger";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { tenant } = req.query;
    if (isValidSubdomain(tenant)) {
      const comicData = await getComicProfile(tenant);
      if (comicData.success) {
        const profile = comicData.data;
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("CAVEARTWBCMX_current-comic", profile.id as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          }),
        );
        return res.status(200).send(comicData.data);
      }

      const latestComicID = Number(req.cookies['CAVEARTWBCMX_current-comic'])
      const latestComicProfile = await getComicProfile(latestComicID)
      return res.status(400).send(latestComicProfile.data);
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
};

export default handler;
