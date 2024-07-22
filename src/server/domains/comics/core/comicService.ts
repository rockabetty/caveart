import {
  isAuthor,
  getRatingId,
  addAuthorToComic,
  addGenresToComic,
  addContentWarningsToComic,
  addComic
} from "../outbound/comicRepository";
import logger from "@logger";
import extractUserIdFromToken from "@domains/users/utils/extractUserIdFromToken";
import formidable from "formidable";
import { ErrorKeys } from "../errors.types";

const invalidRequest = {
  success: false,
  error: ErrorKeys.INVALID_REQUEST,
};

const isValidSubdomain = function(rawSubdomain) {
  const subdomain = rawSubdomain.toLowerCase();
  const subdomainFilter = /^(?!-)(?!.*--)[a-z0-9-]{1,63}(?<!-)$/;
  return subdomainFilter.test(subdomain)) {
}

export async function canEditComic(
  token: string,
  comicId: number | string,
  userID: number,
) {
  try {
    const userId = await extractUserIdFromToken(token);
    const ifOwnsComic = await isAuthor(Number(userId), comicId);
    return {
      success: true,
      edit: ifOwnsComic,
    };
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: error,
    };
  }
}

const isValidRating = function (rating:string) {
  try {
    const ratingId = await getRatingId(rating);
    if (isNaN(ratingId)) {
      return false;
    }
  } catch (error) {
    throw error;
  }
  return true;
}

const isValidIDList = function (list: number[]) {
  if (!Array.isArray(list)) {
    return false;
  }
  for (let entry of list) {
    if (isNaN(entry)) {
      return false;
    }
  }
  return true
}

const isValidDescription = function (description: string) {
  return description.length < 1024
}

const isValidCommentOption = function (option: string) {
  const validComments = ["Allowed", "Moderated", "Disabled"];
  return validComments.includes(option);
} 

const isValidVisibilityOption = function (option: string) {
  const validVisibilities = ["Public", "Unlisted", "Invite-Only"];
  return validVisibilities.includes(option)
}

const isValidLikesOption = function (option: "true" | "false" | boolean) {
  if (selectedLikesOption !== "true" && selectedLikesOption !== "false") {
    return typeof option === 'boolean'
  }
  return true
}

export async function createComic(
  fields: formidable.Fields,
  files: formidable.Files,
  userId: number
) {
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
    is_private: false,
  };

  const requiredFields = ["rating", "title", "subdomain"];

  for (let field of requiredFields) {
    if (!fields[field]) {
      return invalidRequest;
    }
  }

  profile.title = fields.title[0];
 
  const subdomain = fields.subdomain[0].toLowerCase();
  if (!isValidSubdomain(subdomain)) {
    return invalidRequest;
  }

  const rating = fields.rating[0];
  if (!isValidRating(rating)) {
    return invalidRequest;
  }
  const ratingId = getRatingId(rating);
  profile.rating = ratingId;

  const description = fields.description[0];
  if (!isValidDescription) {
    return invalidRequest;
  }
  profile.description = description;

  const genresValid = isValidIDList(fields["genres[]"]);
  if (genresValid) {
    profile.genres = fields["genres[]"];
  } else {
    return invalidRequest;
  }
 
  const contentWarningsValid = isValidIDList(fields["content[]"]);
  if (contentWarningsValid) {
    profile.content = fields["content[]"];
  } else {
    return invalidRequest;
  }
 
  const selectedCommentsOption = fields.comments[0];
  if (!isValidCommentOption(selectedCommentsOption)) {
    return invalidRequest;
  }
  profile.comments = selectedCommentsOption !== "Disabled";
  profile.moderate_comments = selectedCommentsOption === "Moderated";
 
 
  const selectedVisibilityOption = fields.visibility[0];
  if (!isValidVisibilityOption(selectedVisibilityOption)) {
    return invalidRequest;
  }
  profile.is_private = selectedVisibilityOption === "Invite-Only";
  profile.is_unlisted = selectedVisibilityOption === "Unlisted";

  const selectedLikesOption = fields.likes[0];
  if (!isValidLikesOption(selectedLikesOption)) {
    return invalidRequest;
  }
  profile.likes = selectedLikesOption === "true";

  if (files) {
    try {
      await Promise.all(
        Object.keys(files).map(async (key) => {
          const file = files[key][0];
          profile.thumbnail = `/uploads/${file.newFilename}`;
        })
      );
    } catch (fileErr) {
      logger.error(fileErr);
      return {
        success: false,
        error: ErrorKeys.FILE_UPLOAD_ERROR,
      };
    }
  }

  try {
    const id = await addComic(profile);
    if (id) {
      await addAuthorToComic(id, userId);
    
      if (profile.genres.length > 0) {
        await addGenresToComic(id, profile.genres);
      }

      if (profile.content.length > 0) {
        await addContentWarningsToComic(id, profile.content);
      }

      return {
        success: true,
        data: { id },
      };
    } else {
      return {
        success: false,
        error: ErrorKeys.GENERAL_SERVER_ERROR,
      };
    }
  } catch (error: any) {
    if (error.code === "23505") {
      const errorKey = error.constraint === "comics_title_key" ? ErrorKeys.TITLE_TAKEN : ErrorKeys.SUBDOMAIN_TAKEN;
      return {
        success: false,
        error: errorKey,
      };
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
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
}