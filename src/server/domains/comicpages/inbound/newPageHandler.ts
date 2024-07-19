import { NextApiHandler, NextApiRequest } from 'next';
import formidable from "formidable";
import ensureUploadDirectoryExists from "@services/uploader/ensureUploadDirectoryExists";
import imageOptions from "@services/uploader/imagedefaults";
// import { createPage } from '../core/userService';
// import { ErrorKeys } from '../errors.types';
import { ComicPage } from '../comicpage.types';
import { withAuth } from "@domains/users/middleware/withAuth";
import { logger } from "@logger";

/*
export type ComicPage = {
  id?: Readonly<number>,
  page_number: number,
  img: string,
  comic_id: Readonly<number>,
  chapter_id?: number,
  author_comment?: string,
  created_at: Readonly<Date>,
  release_on?: Date,
  view_count?: number,
  like_count?: number
}
*/

const newPageHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

};

export default withAuth(newPageHandler);

/*

import { logger } from "../../../services/logs";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

const readForm = (req: NextApiRequest): Promise<SubmissionResult> => {
  const form = formidable(imageOptions);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  let id: number | null = null;

  try {
    ensureUploadDirectoryExists();
    const submission = await readForm(req);
    const fields = submission.fields;
    const processedFields: ProcessedFields = {};

    let newFilename = "";
    if (submission?.files) {
      console.log("##############################")
      const processedFiles: any = {};
      try {
        const files = submission.files;
        console.log(files)
        await Promise.all(
          Object.keys(files).map(async (key) => {
            const file = files[key][0];
            processedFields.thumbnail = `/uploads/${file.newFilename}`;
          }),
        );
      } catch (fileErr) {
        return res.status(500).json({ error: fileErr });
      }
    }

    if (fields) {
      console.log("PRocessing fields")
      if (fields.title) {
        const title = fields.title[0];
        // Validating that the title is alpahnumeric or has !, -, ?
        const titleRegex = /^[a-zA-Z0-9 !\-?]+$/;
        if (!titleRegex.test(title)) {
          return res.status(400).json({ error: "invalidTitleFormat" });
        }
        processedFields.title = title;
      }

      console.log("Genres")

      if (fields.genres) {
        const { genres } = fields;
        if (!Array.isArray(genres)) {
          return res.status(400).json({ error: "invalidGenreFormat" });
        }
        for (let entry of genres) {
          if (isNaN(entry)) {
            return res.status(400).json({ error: "invalidGenreFormat" });
          }
        }
        processedFields.genres = genres;
      }

  console.log("Content warnigns")
      if (fields.content) {
        const { content } = fields;
        if (!Array.isArray(content)) {
          return res.status(400).json({ error: "invalidContentWarningFormat" });
        }
        for (let entry of content) {
          if (isNaN(entry)) {
            return res
              .status(400)
              .json({ error: "invalidContentWarningFormat" });
          }
        }
        processedFields.content = content;
      }

console.log("Subdo")
      if (fields.subdomain) {
        const subdomain = fields.subdomain[0];
        // Validating that subdomain is purely alphanumeric with hyphens or underscores only
        const subdomainRegex = /^[a-zA-Z0-9_-]+$/;
        if (!subdomainRegex.test(subdomain)) {
          return res.status(400).json({ error: "invalidSubdomainFormat" });
        }
        processedFields.subdomain = subdomain;
      }

console.log("Desc")
      if (fields.description) {
        const description = fields.description[0];
        if (description.length > 1024) {
          return res.status(400).json({ error: "invalidDescriptionLength" });
        }
        processedFields.description = description;
      }

console.log("Comments")
      if (fields.comments) {
        const selectedCommentsOption = fields.comments[0];

        const validComments = ["Allowed", "Moderated", "Disabled"];
        if (!validComments.includes(selectedCommentsOption)) {
          return res.status(400).json({ error: `invalidCommentOption` });
        }

        processedFields.comments = selectedCommentsOption !== "Disabled";
        if (selectedCommentsOption === "Moderated") {
          processedFields.moderate_comments = true;
        }
      }
      console.log("visibo")

      if (fields.visibility) {
        const selectedVisibilityOption = fields.visibility[0];
        const validVisibilities = ["Public", "Unlisted", "Invite-Only"];
        if (!validVisibilities.includes(selectedVisibilityOption)) {
          return res.status(400).json({ error: "invalidVisibilityOption" });
        }
        if (selectedVisibilityOption === "Invite-Only") {
          processedFields.is_private = true;
        }
        if (selectedVisibilityOption === "Unlisted") {
          processedFields.is_unlisted = true;
        }
      }
      console.log("raiku")

      if (fields.likes) {
        const selectedLikesOption = fields.likes[0];
        if (selectedLikesOption !== "true" && selectedLikesOption !== "false") {
          return res.status(400).json({ error: "invalidLikesOption" });
        }
        processedFields.likes = selectedLikesOption === "true";
      }
console.log("rating")
      let rating: string = "";
      if (!fields.rating[0]) {
        res.status(400).json({ error: "invalidRating" });
      }
      rating = await getRatingId(fields.rating[0]);

      let comicData: Comic = {};

      const {
        title,
        subdomain,
        description,
        thumbnail,
        is_private,
        is_unlisted,
        comments,
        moderate_comments,
        likes,
      } = processedFields;

      comicData = {
        title,
        subdomain,
        description,
        thumbnail,
        is_private,
        is_unlisted,
        comments,
        moderate_comments,
        likes,
        rating,
      };
      console.log("creation call")

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
        return res.status(201).send({ message: "success", id });
      }
    }
  } catch (error: any) {
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
    let errorMessage = "generalServerError";
    if (error.code === "23505") {
      if (error.constraint === "comics_title_key") {
        errorMessage = "comicTitleTaken";
      } else {
        errorMessage = "comicSubdomainTaken";
      }
    }
    return res.status(500).send({ error: errorMessage });
  }
};

export default withAuth(handler);

*/