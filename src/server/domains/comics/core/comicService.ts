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

export function validateIDList(list: number[]) {
  if (!Array.isArray(list)) {
    return invalidRequest;
  }
  for (let entry of list) {
    if (isNaN(entry)) {
      return invalidRequest;
    }
  }
  return {
    success: true,
    data: list,
  };
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
 
  const subdomain = fields.subdomain[0];
  const subdomainFilter = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)$/;
  if (!subdomainFilter.test(subdomain)) {
    return invalidRequest;
  }
  profile.subdomain = subdomain;
 
  try {
    const ratingId = await getRatingId(fields.rating[0]);
    if (isNaN(ratingId)) {
      return invalidRequest;
    }
    profile.rating = ratingId;
  } catch (error) {
    return invalidRequest;
  }

  if (fields.description[0]) {
    if (fields.description[0].length > 1024) {
      return invalidRequest;
    }
    profile.description = fields.description[0];
  }

  const genresValid = validateIDList(fields["genres[]"]);
  if (genresValid.success) {
    profile.genres = fields["genres[]"];
  } else {
    return invalidRequest;
  }
 
  const contentWarningsValid = validateIDList(fields["content[]"]);
  if (contentWarningsValid.success) {
    profile.content = fields["content[]"];
  } else {
    return invalidRequest;
  }
 
  const selectedCommentsOption = fields.comments[0];
  const validComments = ["Allowed", "Moderated", "Disabled"];
  if (!validComments.includes(selectedCommentsOption)) {
    return invalidRequest;
  }
  profile.comments = selectedCommentsOption !== "Disabled";
  profile.moderate_comments = selectedCommentsOption === "Moderated";
 
  if (fields.visibility) {
    const selectedVisibilityOption = fields.visibility[0];
    const validVisibilities = ["Public", "Unlisted", "Invite-Only"];
    if (!validVisibilities.includes(selectedVisibilityOption)) {
      return invalidRequest;
    }
    profile.is_private = selectedVisibilityOption === "Invite-Only";
    profile.is_unlisted = selectedVisibilityOption === "Unlisted";
  }

  if (fields.likes) {
    const selectedLikesOption = fields.likes[0];
    if (selectedLikesOption !== "true" && selectedLikesOption !== "false") {
      return invalidRequest;
    }
    profile.likes = selectedLikesOption === "true";
  }

  if (files) {
    try {
      await Promise.all(
        Object.keys(files).map(async (key) => {
          const file = files[key][0];
          profile.thumbnail = `/uploads/${file.newFilename}`;
        })
      );
    } catch (fileErr) {
      logger.error(`File upload error: ${fileErr}`);
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