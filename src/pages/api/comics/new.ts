import { NextApiHandler } from 'next';
import { withAuth } from '../../../auth/server/withAuth';
import { extractUserIdFromToken } from  '../../../auth/server/extractUserIdFromToken';
import {
  createComic,
  addGenresToComic,
  addContentWarningsToComic,
  addAuthorToComic,
  deleteComic,
  removeGenresFromComic,
  removeContentWarningsFromComic,
  removeAuthorsFromComic
} from '../../../data/comics';

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
    comments: comments !== 'Disabled',
    likes,
    is_private: visibility === 'Private',
    is_unlisted: visibility === 'Unlisted',
    moderate_comments: comments === 'Moderated'
  };

  // Validating that the title is alpahnumeric or has !, -, ?
  const titleRegex = /^[a-zA-Z0-9 !\-?]+$/;
  if (!titleRegex.test(title)) {
    return res.status(400).json({ error: 'invalidTitleFormat' });
  }

  // Validating that subdomain is purely alphanumeric with hyphens or underscores only
  const subdomainRegex = /^[a-zA-Z0-9_-]+$/;
  if (!subdomainRegex.test(subdomain)) {
    return res.status(400).json({ error: 'invalidSubdomainFormat' });
  }

  if (description.length > 1000) {
    return res.status(400).json({ error: 'invalidDescriptionLength' });
  }

  let id = null;
  let stage = '';
 
  try {
    const genreList = Object.keys(genres).map(key => {
      const num = parseInt(key, 10);
      if (isNaN(num)) {
          return res.status(400).json({ error: 'invalidGenreFormat' });
      }
      return num;
    });

    const warningList = Object.values(content).map(value => {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
          return res.status(400).json({ error: 'invalidContentWarningFormat' });
      }
      return num;
    });

    const validComments = ['Allowed', 'Moderated', 'Disabled'];
    if (!validComments.includes(comments)) {
      return res.status(400).json({ error: 'invalidCommentOption' });
    }

    const validVisibilities = ['Public', 'Private', 'Invite-Only'];
    if (!validVisibilities.includes(visibility)) {
      return res.status(400).json({ error: 'invalidVisibilityOption' });
    }

    if (typeof likes !== 'boolean') {
      return res.status(400).json({ error: 'invalidLikesOption' });
    }

    stage = 'Creating comic'
    const newComic = await createComic(comicTableData);
    id = newComic.id;
    stage = 'Adding genres'
    const comicGenres = await addGenresToComic(id, genreList);
    stage = 'Adding content warnings'
    const comicWarnings = await addContentWarningsToComic(id, warningList);
    stage = 'Getting user ID'
    const userID = await extractUserIdFromToken(req, false);
    stage = 'Adding authors'
    const comicAuthor = await addAuthorToComic(id, userID);
    return res.status(201).send("Comic created successfully");
  }
  catch (error) {
    console.error(`Error during comic creation while ${stage}:`, error);
    if (id) {
      try {
        stage = 'detaching genres';
        const detachGenres = await removeGenresFromComic(id);
        stage = 'detaching content warnings';
        const detachWarnings = await removeContentWarningsFromComic(id);
        stage = 'detaching authors';
        const detachAuthor = await removeAuthorsFromComic(id);
        stage = 'deleting comic'
        const deleteComicOperation = await deleteComic(id);
      } catch (cleanupError) {
        console.error(`Error during cleanup while ${stage}:`, cleanupError);
      }
    }
    return res.status(500).send("Failed to create comic");
  }
}

export default withAuth(handler);