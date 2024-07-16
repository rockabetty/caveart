import { NextApiRequest, NextApiResponse } from 'next';
import { addGenresToComic, removeGenresFromComic } from '../../../../data/comics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { comicId } = req.query;

  if (req.method === 'POST') {
    const comic = Number(comicId);
    
    if (!comic) {
      return res.status(400).json({ message: "Invalid comic ID" });
    }

    const { update } = req.body;

    if (typeof current !== 'object' || typeof update !== 'object') {
      return res.status(400).json({ message: "Invalid request body" });
    }
    
    try {
      console.log(current)
      console.log(update)
      // let deleteIDs: number[] = [];
      // let addIDs: number[] = [];

      // for (let key in current) {
      //   if (!update[key]) {
      //     deleteIDs.push(Number(key));
      //   }
      // }

      // if (deleteIDs.length > 0) {
      //   await removeContentWarningsFromComic(comic, deleteIDs);
      // }

      // for (let key in update) {
      //   if (!current[key]) {
      //     addIDs.push(Number(key));
      //   }
      // }

      // if (addIDs.length > 0) {
      //   await addContentWarningsToComic(comic, addIDs);
      // }

      return res.status(200).json({ message: 'Content warnings updated successfully' });
    } catch (error) {
      console.error('Error updating genres:', error);
      return res.status(500).json({ message: 'Failed to update content warnings' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}