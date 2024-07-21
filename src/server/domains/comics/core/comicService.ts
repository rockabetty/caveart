import { isAuthor, getRatingId } from '../outbound/comicRepository';
import logger from '@logger';
import extractUserIdFromToken from '@domains/users/utils/extractUserIdFromToken';
import formidable from 'formidable'

const invalidRequest = {
  success: false,
  error: ErrorKeys.INVALID_REQUEST
}

export async function canEditComic(
  token: string,
  comicId: number | string,
  userID: number
) {
  try {
    const userId = await extractUserIdFromToken(token);
    const ifOwnsComic = await isAuthor(Number(userId), comicId);
    return {
      success: true,
      edit: ifOwnsComic
    }
  }
  catch (error: any) {
    logger.error(error)
    return {
      success: false,
      error: error
    }
  }
}

export function validateIDList(list: number[]) {
  if (!Array.isArray(list)) {
      return {
        success: false,
        error:  ErrorKeys.INVALID_REQUEST
      }
  }
  for (let entry of list) {
    if (isNaN(entry)) {
      return {
        success: false,
        error: ErrorKeys.INVALID_REQUEST
      }
    }
  }
  return {
    success: true,
    data: list
  }
};

export async function createComic(
  fields: formidable.Fields,
  files: formidable.Files) {

  let profile = {
    title: "",
    subdomain: "",
    description: "",
    genres: [],
    content: [],
    visibility: "Public",
    likes: true,
    rating: "All Ages",
    comments: false,
    moderate_comments: false,
    is_unlisted: false,
    is_private: false
  }


  const requiredFields = [
    "rating",
    "title",
    "subdomain"
  ]

  for (let field of requiredFields) {
    if (!fields[field]) {
      return invalidRequest
    }
  }

  profile.title = fields.title[0];

  subdomain = fields.subdomain[0];
  subdomainFilter = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)$/;
  if (!subdomainFilter.test(subdomain)) {
    return invalidRequest
  }
  profile.subdomain = fields.subdomain[0];

  const ratingId = await getRatingId(fields.rating[0]);
  if (isNaN(ratingId)) {
    return invalidRequest
  }
  profile.rating = ratingId;

  if (fields.description[0]) {
    if (fields.description[0].length > 1024) {
      return invalidRequest
    }
    profile.description = fields.description[0]
  }

  const genresValid = validateIDList(fields.genres[0]);
  if (genresValid.success) {
    profile.genres = fields.genres[0]
  } else {
    return invalidRequest
  }

  const contentWarningsValid = validateIDList(fields.content[0]);
  if (contentWarningsValid.success) {
    profile.content = fields.content[0]
  } else {
    return invalidRequest
  }

  const selectedCommentsOption = fields.comments[0];
  const validComments = ["Allowed", "Moderated", "Disabled"];
  if (!validComments.includes(selectedCommentsOption)) {
    return invalidRequest
  }
  profile.comments = selectedCommentsOption !== "Disabled";
  if (selectedCommentsOption === "Moderated") {
    processedFields.moderate_comments = true;
  }

  if (fields.visibility) {
    const selectedVisibilityOption = fields.visibility[0];
    const validVisibilities = ["Public", "Unlisted", "Invite-Only"];
    if (!validVisibilities.includes(selectedVisibilityOption)) {
      return invalidRequest
    }
    if (selectedVisibilityOption === "Invite-Only") {
      profile.is_private = true;
    }
    if (selectedVisibilityOption === "Unlisted") {
      profile.is_unlisted = true;
    }
  }

  if (fields.likes) {
    const selectedLikesOption = fields.likes[0];
    if (selectedLikesOption !== "true" && selectedLikesOption !== "false") {
      return invalidRequest
    }
    profile.likes = selectedLikesOption === "true";
  }

  if (files) {
    const processedFiles: any = {};
    try {
      await Promise.all(
        Object.keys(files).map(async (key) => {
          const file = files[key][0];
          profile.thumbnail = `/uploads/${file.newFilename}`;
        })
      )
    } catch (fileErr) {
      return {
        success: false,
        error: ErrorKeys.FILE_UPLOAD_ERROR
      }
    }
  }

  try {
    const id = await createComic(profile);
    if (id) {

      await addAuthorToComic(id, userID);

      if (profile.genres.length > 0) {
        await addGenresToComic(id, profile.genres);
      }

      if (profile.content.length > 0) {
        await addContentWarningsToComic(id, profile.content);
      }

      return {
        success: true,
        data: { id }
      }
    } return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR
    }
  } catch (error: any) {
      logger.error(error)
      if (error.code === "23505") {
        let errorMessage = "";
        if (error.constraint === "comics_title_key") {
          errorKey = ErrorKeys.TITLE_TAKEN;
        } else {
          errorKey = ErrorKeys.SUBDOMAIN_TAKEN;
        }
        return {
          success: false,
          error: errorKey
        }
      }
      if (id) {
      try {
        await deleteComic(id);
      } catch (cleanupError) {
        logger.error(cleanupError); 
      }
    }
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR
    }    
  }
}
