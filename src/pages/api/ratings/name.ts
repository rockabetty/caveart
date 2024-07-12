import { NextApiHandler } from "next";
import { getRatingDefs } from "../../../data/comics";

const handler: NextApiHandler = async (req, res) => {
  try {
    const ratings = await getRatingDefs('name');
    return res.status(200).send(ratings);
  } catch (error: any) {
    return res.status(500).send(error)
  }
}


export default handler;
