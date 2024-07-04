import { NextApiHandler, NextApiRequest } from 'next';
import formidable from "formidable"
import imageOptions from "../../../services/uploader/imagedefaults"
import ensureUploadDirectoryExists from  "../../../services/uploader/ensureUploadDirectoryExists"
import { withAuth } from '../../../services/auth/server/withAuth';
import { extractUserIdFromToken } from  '../../../services/auth/server/extractUserIDFromToken';
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
import { Comic } from '../../../data/types';
import { logger } from '../../../services/logs';

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SubmissionResult {
  fields?: formidable.Fields;
  files?: formidable.Files;
}

interface ProcessedFields {
  title?: string;
  subdomain?: string;
  description?: string;
  genres?: number[];
  content?: number[];
  moderate_comments?: boolean;
  comments?: boolean;
  is_private?: boolean;
  is_unlisted?: boolean;
  thumbnail?: string;
  likes?: boolean;
  rating?: string;
}

const readForm = (req: NextApiRequest)
:Promise<SubmissionResult> => {
  const form = formidable(imageOptions);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({fields, files})
    })
  })
}

const handler: NextApiHandler = async (req, res) => {

 let id: number | null = null;
 
  try {
     ensureUploadDirectoryExists();
    const submission = await readForm(req)
    const fields = submission.fields;
    const processedFields: ProcessedFields = {};

    let newFilename = "";
    if (submission?.files?.files) {
       newFilename = submission?.files?.files[0].newFilename || '';
       processedFields.thumbnail = `uploads/${newFilename}`;
    }

    /*
    When form data is parsed by formidable, it will return each form field
    value as an array, even if it's a single value. This is because the same
    field name can theoretically appear multiple times in multipart/form-data.
    */

    if (fields) {

      if (fields.title) {
        const title = fields.title[0];
        // Validating that the title is alpahnumeric or has !, -, ?
        const titleRegex = /^[a-zA-Z0-9 !\-?]+$/;
        if (!titleRegex.test(title)) {
          return res.status(400).json({ error: 'invalidTitleFormat' });
        }
        processedFields.title = title;
      }

      if (fields.genres) {
        const genres = JSON.parse(fields.genres[0]);
        let genreList: number[] = [];

        Object.keys(genres).map(key => {
          const num = parseInt(key, 10);
          if (isNaN(num)) {
              return res.status(400).json({ error: 'invalidGenreFormat' });
          }
          genreList.push(num);
        });
        processedFields.genres = genreList;
      }

      if (fields.content) {
        const content = JSON.parse(fields.content[0]);
        let contentWarningList: number[] = [];
        Object.values(content).map(value => {
          const num = parseInt(value as string, 10);
          if (isNaN(num)) {
            return res.status(400).json({ error: 'invalidContentWarningFormat' });
          }
          contentWarningList.push(num)
        });

        processedFields.content = contentWarningList;
      }

      if (fields.subdomain) {
        const subdomain = fields.subdomain[0]
        // Validating that subdomain is purely alphanumeric with hyphens or underscores only
        const subdomainRegex = /^[a-zA-Z0-9_-]+$/;
        if (!subdomainRegex.test(subdomain)) {
          return res.status(400).json({ error: 'invalidSubdomainFormat' });
        }
        processedFields.subdomain = subdomain;
      }

      if (fields.description) {
        const description = fields.description[0];
        if (description.length > 1024) {
          return res.status(400).json({ error: 'invalidDescriptionLength' });
        }
        processedFields.description = description;
      }

      if (fields.comments) {
        const selectedCommentsOption = fields.comments[0]

        const validComments = ['Allowed', 'Moderated', 'Disabled'];
        if (!validComments.includes(selectedCommentsOption)) {
          return res.status(400).json({ error: 'invalidCommentOption' });
        }

        processedFields.comments = selectedCommentsOption !== 'Disabled'
        if (selectedCommentsOption === 'Moderated') {
          processedFields.moderate_comments = true;
        }      
      }

      if (fields.visibility) {
        const selectedVisibilityOption = fields.visibility[0];
        const validVisibilities = ['Public', 'Private', 'Invite-Only'];
        if (!validVisibilities.includes(selectedVisibilityOption)) {
          return res.status(400).json({ error: 'invalidVisibilityOption' });
        }
        if (selectedVisibilityOption === 'Invite-Only') {
          processedFields.is_private = true
        }
        if (selectedVisibilityOption === 'Unlisted') {
          processedFields.is_unlisted = true
        }
      }

      if (fields.likes) {
        const selectedLikesOption = fields.likes[0];
        if (selectedLikesOption !== 'true' && selectedLikesOption !== 'false') {
          return res.status(400).json({ error: 'invalidLikesOption' }); 
        }
        processedFields.likes = selectedLikesOption === 'true';
      }

      if (!fields.rating) {
        res.status(400).json({ error: 'invalidRating' });
      }

      let comicData: Comic = {};

      const {
        title,
        subdomain,
        description, 
        thumbnail,
        comments,
        is_unlisted,
        is_private,
        moderate_comments,
        likes,
        rating 
      } = processedFields

      comicData = {
        title,
        subdomain,
        description, 
        thumbnail,
        comments,
        is_unlisted,
        is_private,
        moderate_comments,
        likes,
        rating 
      };

      id = await createComic(comicData);
      if (id) {
        if (processedFields.genres) {
           await addGenresToComic(id, processedFields.genres);
        }
       
        if (processedFields.content) {
          await addContentWarningsToComic(id, processedFields.content);
        }
     
        const userID = await extractUserIdFromToken(req, false);
        await addAuthorToComic(id, parseInt(userID)); 
        return res.status(201).send("Comic created successfully");

      } else {
        logger.error(new Error("No comic ID created"));
        return res.status(500).send("Failed to create comic.");
      }
    } 
  } 
  catch (error: any) {
    logger.error(new Error(`Error during comic creation: ${error}`));
    if (id) {
      try {
        await removeGenresFromComic(id);
        await removeContentWarningsFromComic(id);
        await removeAuthorsFromComic(id);
        await deleteComic(id);
      } catch (cleanupError) {
        logger.error(new Error(`Error during cleanup: ${cleanupError}`));
      }
    }
    return res.status(500).send("Failed to create comic.");
  }
}

export default withAuth(handler);