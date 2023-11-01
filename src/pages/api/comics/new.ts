import { NextApiHandler } from 'next';
import { withAuth } from '../../../auth/server/withAuth';
import { extractUserIdFromToken } from  '../../../auth/server/extractUserIdFromToken';

const handler: NextApiHandler = async (req, res) => {
  const {
    title,
    subdomain,
    description,
    genres,
    content,
    comments,
    visibility,
    likes,
    rating
  } = req.body;

  const comicTableData = {
    title,
    subdomain,
    description,
    comments: commments !== 'Disabled',
    likes,
    is_private: visibility === 'Private',
    is_unlisted: visibility === 'Unlisted',
    moderate_comments: comments === 'Moderated'
  };

  try {
    const genreList: number[] = Object.keys(genres);
    const warningList: number[] = Object.values(content);
    const newComic = await createComic(comicTableData);
    const {id} = newComic;
    const comicGenres = await addGenresToComic(id, genreList);
    const comicWarnings = await addContentWarningsToComic(id, warningList);
    const userID = await extractUserIdFromToken(req, false);
    const comicAuthor = await addAuthorToComic(id, userID)
    catch (error) {
      const deleteComic = await deleteComic(id);
      const detachGenres = await removeGenresFromComic(id);
      const detachWarnings = await removeContentWarningsFromComic(id);
      const detachAuthor = await removeAuthorsFromComic(id);
    }
  }
  return res.status(200).send("ok");
}

export default withAuth(handler);