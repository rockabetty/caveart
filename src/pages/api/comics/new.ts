import { NextApiHandler } from 'next';
import formidable from "formidable"
import imageOptions from "../../../services/uploader/imagedefaults"
import ensureUploadDirectoryExists from  "../../../services/uploader/ensureUploadDirectoryExists"
import { withAuth } from '../../../services/auth/server/withAuth';
import { extractUserIdFromToken } from  '../../../services/auth/server/extractUserIdFromToken';
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

export const config = {
  api: {
    bodyParser: false,
  },
}

const readForm = (req: NextApiRequest)
:Promise<{fields?: formidable.Fields; files?: formidable.Files}> => {
  const form = formidable(imageOptions);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({fields, files})
    })
  })
}

const handler: NextApiHandler = async (req, res) => {

  let id = null;
 
  try {
    ensureUploadDirectoryExists();
    const submission = await readForm(req)
    const fields = submission.fields;
    const {newFilename} = submission?.files?.files[0] || '';

    /*
    When form data is parsed by formidable, it will return each form field
    value as an array, even if it's a single value. This is because the same
    field name can theoretically appear multiple times in multipart/form-data.

    We want our form data to be a particular format, though, so we're going to
    gussy up the data into the format we want, here, with processedFields.
    */
    const processedFields = {};
    for (const key in fields) {
      if (fields[key] instanceof Array && fields[key].length > 0) {
        processedFields[key] = fields[key][0]; // Take the first element of the array
      } else {
        processedFields[key] = fields[key];
      }
    }

    if (processedFields.genres) {
      processedFields.genres = JSON.parse(processedFields.genres);
    }
    if (processedFields.content) {
      processedFields.content = JSON.parse(processedFields.content);
    }

    const {
      title,
      subdomain,
      description,
      genres,
      content,
      comments,
      visibility,
      thumbnail,
      likes,
      rating
    } = processedFields

    const comicTableData = {
      title,
      subdomain,
      description,
      thumbnail: `/uploads/${newFilename}`,
      comments: comments !== 'Disabled',
      likes: likes === 'true',
      is_private: visibility === 'Invite-Only',
      is_unlisted: visibility === 'Unlisted',
      moderate_comments: comments === 'Moderated'
    };

    // Validating that the title is alpahnumeric or has !, -, ?
    const titleRegex = /^[a-zA-Z0-9 !\-?]+$/;
    if (!titleRegex.test(title)) {
      console.log(title)
      return res.status(400).json({ error: 'invalidTitleFormat' });
    }

    if (likes !== 'true' && likes !== 'false') {
      return res.status(400).json({ error: 'invalidLikesOption' });
    }

    // Validating that subdomain is purely alphanumeric with hyphens or underscores only
    const subdomainRegex = /^[a-zA-Z0-9_-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return res.status(400).json({ error: 'invalidSubdomainFormat' });
    }

    if (description.length > 1000) {
      return res.status(400).json({ error: 'invalidDescriptionLength' });
    }

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

    const newComic = await createComic(comicTableData);
    id = newComic.id;
    const comicGenres = await addGenresToComic(id, genreList);
    const comicWarnings = await addContentWarningsToComic(id, warningList);
    const userID = await extractUserIdFromToken(req, false);
    const comicAuthor = await addAuthorToComic(id, userID);
    return res.status(201).send("Comic created successfully");
  }
  catch (error) {
    console.error(`Error during comic creation:`, error);
    if (id) {
      try {
        const detachGenres = await removeGenresFromComic(id);
        const detachWarnings = await removeContentWarningsFromComic(id);
        const detachAuthor = await removeAuthorsFromComic(id);
        const deleteComicOperation = await deleteComic(id);
      } catch (cleanupError) {
        console.error(`Error during cleanup:`, cleanupError);
      }
    }
    return res.status(500).send("Failed to create comic");
  }
}

export default withAuth(handler);