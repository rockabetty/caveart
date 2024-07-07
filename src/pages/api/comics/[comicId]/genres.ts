import { NextApiRequest, NextApiResponse } from 'next';
import { addGenresToComic, removeGenresFromComic } from '../../../../data/comics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { comicId } = req.query;

  if (req.method === 'POST') {
    const comic = Number(comicId?.toString());
    if (comic) {

      const { current, update } = req.body;
    
      try {
        let deleteIDs:number[] = [];
        let addIDs: number[] = [];
        
        for (let key in current) {
          if (!update[key]) {
            deleteIDs.push(Number(key))
          }
        }

        await removeGenresFromComic(comic, deleteIDs);
        
        for (let key in update) {
          if (!current[key]) {
            addIDs.push(Number(key))
          }
        }

        await addGenresToComic(comic, addIDs);

        return res.status(200).json({ message: 'Genres updated successfully' });
      } catch (error) {
        console.error('Error updating genres:', error);
        return res.status(500).json({ message: 'Failed to update genres' });
      }
    } else {
      res.status(400).send({message: "Not a valid comic ID"})
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}