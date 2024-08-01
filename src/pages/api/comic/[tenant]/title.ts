import { NextApiRequest, NextApiResponse } from "next";
import { editComic } from "@domains/comics/core/comicService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tenant } = req.query;

  if (req.method === "POST") {
    const comic = tenant;

    if (!comic) {
      return res.status(400).json({ message: "Invalid comic ID" });
    }

    const { update } = req.body;

    if (typeof update !== "string") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    try {
      const edit = await editComic(tenant, { title: update });
      if (edit.success) {
        return res.status(200).json({ message: "Title updated successfully" });
      }
      console.log(edit)
      return res.status(500).json({message: editComic.error})
    } catch (error) {
      console.error("Error updating title:", error);
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ message: "A comic with this title already exists." });
      }
      return res.status(500).json({ message: "Failed to update title" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
