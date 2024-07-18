import { NextApiRequest, NextApiResponse } from "next";
import {
  addContentWarningsToComic,
  editComic,
  getRatingId,
  removeContentWarningsFromComic,
} from "@data/comics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { comicId } = req.query;

  if (req.method === "POST") {
    const comic = Number(comicId);

    if (!comic) {
      return res.status(400).json({ message: "invalidComic" });
    }

    const { old, update, rating } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "invalidRequestBody" });
    }

    try {
      let deleteIDs: number[] = [];
      let addIDs: number[] = [];

      for (let key in old) {
        if (!update[key]) {
          deleteIDs.push(Number(old[key].id));
        }
      }

      if (deleteIDs.length > 0) {
        await removeContentWarningsFromComic(comic, deleteIDs);
      }

      for (let key in update) {
        if (!old[key]) {
          addIDs.push(Number(update[key].id));
        }
      }

      if (addIDs.length > 0) {
        await addContentWarningsToComic(comic, addIDs);
      }

      const ratingId = await getRatingId(rating);

      await editComic(comicId, { rating: ratingId });

      return res
        .status(200)
        .json({ message: "Content warnings updated successfully" });
    } catch (error) {
      console.error("Error updating genres:", error);
      return res
        .status(500)
        .json({ message: "Failed to update content warnings" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
