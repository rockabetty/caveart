import { NextApiRequest, NextApiResponse } from "next";
import { editComic } from "../../../../data/comics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { comicId } = req.query;

  if (req.method === "POST") {
    const comic = Number(comicId);

    if (!comic) {
      return res.status(400).json({ message: "Invalid comic ID" });
    }

    const { update } = req.body;

    if (typeof update !== "string") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    try {
      await editComic(comicId, { subdomain: update });
      return res
        .status(200)
        .json({ message: "Subdomain updated successfully" });
    } catch (error) {
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ message: "A comic with this subdomain already exists." });
      }
      return res.status(500).json({ message: "Failed to update subdomain" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
