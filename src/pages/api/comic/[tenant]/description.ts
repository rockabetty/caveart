import { NextApiRequest, NextApiResponse } from "next";
import { editComic } from "@data/comics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tenant } = req.query;
  if (req.method === "POST") {
    const comic = Number(tenant);

    if (!comic) {
      return res.status(400).json({ message: "Invalid comic ID" });
    }

    const { update } = req.body;

    if (typeof update !== "string") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    try {
      await editComic(tenant, { description: update });
      return res
        .status(200)
        .json({ message: "description updated successfully" });
    } catch (error) {
      console.error("Error updating title:", error);
      return res.status(500).json({ message: "Failed to update description" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
