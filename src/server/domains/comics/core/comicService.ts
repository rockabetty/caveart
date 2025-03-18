import {
  isAuthor,
  getRatingId,
  addAuthorToComic,
  getAuthorsOfComic,
  getAllGenres,
  getRatingDefs,
  addGenresToComic,
  deleteComic as deleteComicFromDatabase,
  removeGenresFromComic,
  removeContentWarningsFromComic,
  removeAllGenresFromComic,
  removeAllContentWarningsFromComic,
  removeAuthorsFromComic,
  addContentWarningsToComic,
  getAllContentWarnings,
  getComicIdFromSubdomain,
  addComic,
  createComicWithRelations,
  editComic as editComicTable,
  getComicThumbnail,
  selectComicProfile,
  getGenres,
  getComicGenres,
  getComicContentWarnings,
} from "../outbound/comicRepository";
import { deleteFromS3 } from "@server-services/uploader";
import { sanitizeLongformText } from "@server-services/sanitizers";
import logger from "@logger";
import extractUserIdFromToken from "@domains/users/utils/extractUserIdFromToken";
import formidable from "formidable";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as GeneralErrorKeys } from "../../../errors.types";
import { ErrorKeys as FileErrorKeys } from "@server-services/uploader/errors.types";
import { QueryResult } from "pg";
import { Comic, CommentsOptions, CommentsSettings, VisibilityOptions, VisibilitySettings } from "../comic.types";

const handleUniqueConstraints = function(constraint:string) {
  return constraint === "comics_title_key"
    ? ErrorKeys.TITLE_TAKEN
    : ErrorKeys.SUBDOMAIN_TAKEN;
}

const isValidTitle = function (title: string) {
  const validTitleRegex = /^[a-zA-Z0-9\s.,!?'"-_]{1,120}$/;
  return validTitleRegex.test(title)
}
const prepareTitle = function(title: string) {
  const newTitle = title.trim().replace(/\s+/g, " ");
  if (!isValidTitle(newTitle)) {
    throw new Error(GeneralErrorKeys.INVALID_REQUEST);
  }
  return newTitle;
}

export const isValidSubdomain = function (rawSubdomain:string) {
  const subdomain = rawSubdomain.toLowerCase();
  const subdomainFilter = /^(?!-)(?!.*--)[a-z0-9-]{1,63}(?<!-)$/;
  return subdomainFilter.test(subdomain);
};
const prepareSubdomain = function (subdomain: string): string {
  const newSubdomain = subdomain.toLowerCase();
  if (!isValidSubdomain(newSubdomain)) {
      throw new Error(GeneralErrorKeys.INVALID_REQUEST);
  }
  return newSubdomain;
}

export const isValidDescription = function (description: string) {
  return description.length < 4096;
};
const prepareDescription = function(description:string): string {
  if (!isValidDescription(description)) {
    throw new Error(GeneralErrorKeys.INVALID_REQUEST);
  }
  return sanitizeLongformText(description);
}

const prepareCommentOptions = function (chosenOption: CommentsOptions): CommentsSettings {
  return {
    comments: chosenOption !== "Disabled",
    moderate_comments: chosenOption === "Moderated" 
  };
}

const prepareVisibilityOptions = function(chosenOption: VisibilityOptions): VisibilitySettings {
  return {
    is_private: chosenOption === "Invite-Only",
    is_unlisted: chosenOption === "Unlisted"
  };
}

export async function getComicId(tenant: string | number) {
  try {
    if (typeof tenant === "number") {
      return tenant;
    }
    const id = await getComicIdFromSubdomain(tenant);
    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: error,
    };
  }
}

export async function canEditComic(userID: number, tenant: number | string) {
  try {
    let comicID = tenant;
    if (typeof tenant !== "number") {
      comicID = await getComicIdFromSubdomain(tenant);
    }
    const ifOwnsComic = await isAuthor(userID, comicID);
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

export async function getAuthors(tenant: string | number) {
  let comicID = undefined;
  if (typeof tenant === "number") {
    comicID = tenant;
  }
  try {
    comicID = await getComicIdFromSubdomain(tenant);
    const authors = await getAuthorsOfComic(comicID);
    return {
      success: true,
      data: { authors },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function deleteComic(comicID: number, author: number) {
  try {
    const authorSelection = await getAuthors(comicID);
    const authorList = authorSelection.data.authors;
    if (authorList.length > 1) {
      return {
        success: false,
        error: ErrorKeys.MULTIPLE_AUTHORS,
      };
    }
    await removeAuthorsFromComic(comicID, [author]);
    await removeAllGenresFromComic(comicID);
    await removeAllContentWarningsFromComic(comicID);
    const success = await deleteComicFromDatabase(comicID);
    return { success };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
}

const prepareRating = async function (rating: string): Promise<number | null> {
  try {
    const ratingId = await getRatingId(rating);
    if (ratingId && isNaN(ratingId)) {
      throw new Error(GeneralErrorKeys.INVALID_REQUEST); 
    }
    return ratingId;
  } catch (error) {
    throw error;
  }
};

const isValidIDList = function (list: number[]) {
  if (list === undefined) {
    return true;
  }
  if (!Array.isArray(list)) {
    return false;
  }
  for (let entry of list) {
    if (isNaN(entry)) {
      return false;
    }
  }
  return true;
};

const prepareComicProfile = async function (fields): Partial<Comic> {
  let profile: ComicUpdate = {};
  try {
    if (fields.title) {
      profile.title = prepareTitle(fields.title);
    }

    if (fields.subdomain) {
      profile.subdomain = prepareSubdomain(fields.subdomain);
    }

    if (fields.description) {
      profile.description = prepareDescription(fields.description);
    }

    if (fields.rating) {
      const rating = await prepareRating(fields.rating);
      if (rating) {
        profile.rating = rating;
      }
    }

    if (fields.comments) {
      const commentsSettings = prepareCommentOptions(fields.comments);
      profile = {...profile, ...commentsSettings}; 
    }

    if (fields.visibility) {
      const visibilitySettings = prepareVisibilityOptions(fields.visibility);
      profile = {...profile, ...visibilitySettings};
    }

    if (fields.likes) {
      profile.likes = fields.likes === true;
    }

    if (fields.thumbnail) {
      profile.thumbnail_image_url = fields.thumbnail;
    }

    if (fields.genres && isValidGenreSelection(fields.genres)) {
      profile.genres = fields.genres
    }

    if (fields.content && isValidContentWarningSelection(fields.content)) {
      profile.content = fields.content
    }
    return profile;
  } catch {
    return {
      success: false,
      data: GeneralErrorKeys.INVALID_REQUEST
    }
  }
}

const isValidGenreSelection = function (selectedGenres) {
  return isValidIDList(selectedGenres);
}

const isValidContentWarningSelection = function (selectedContentWarnings) {
  return isValidIDList(selectedContentWarnings)
}

export async function updateGenres(tenantID: number, old, update) {
  if (typeof old !== "object" || typeof update !== "object") {
    return invalidRequest;
  }
  try {
    let deleteIDs: number[] = [];
    let addIDs: number[] = [];

    for (let key in old) {
      if (!update[key]) {
        deleteIDs.push(Number(key));
      }
    }
    for (let key in update) {
      if (!old[key]) {
        addIDs.push(Number(key));
      }
    }

    if (deleteIDs.length > 0) {
      await removeGenresFromComic(tenantID, deleteIDs);
    }

    if (addIDs.length > 0) {
      await addGenresToComic(tenantID, addIDs);
    }

    return {
      success: true,
      data: update,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function updateComicProfile(id, fields) {
  try {
    let profile: ComicUpdate = await prepareComicProfile(fields);
    const profileKeys = Object.getOwnPropertyNames(profile);
    let oldThumbnail = ""

    if (fields.thumbnail) {
      oldThumbnail = await getComicThumbnail(id);
    }

     if (profileKeys.length > 0) {
      await editComicTable(id, profile);
    }

    if (!!oldThumbnail) {
      const deleteResult = await deleteFromS3(oldThumbnail);
        if (!deleteResult.success) {
          return {
            success: false,
            error: `Failed to delete old thumbnail: ${deleteResult.error}`,
          };
        }
    }

    if (fields["genres[]"] && isValidGenreSelection(fields["genres[]"])) {
      let currentGenres = await getComicGenres(id);
      if (currentGenres) {
        await updateGenres(id, currentGenres, fields["genres[]"])  
      }
    }
    
    if (fields["content_warnings"] && isValidContentWarningSelection(fields["content_warnings"])) {
      let currentContentWarnings = await getComicContentWarnings(id);
      await updateContentWarnings(id, currentContentWarnings, fields["content_warnings"])  
    }

    return {
      success: true,
      data: fields
    }

  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    } else {
      return {
        success: false,
        error: "Could not update comic profile."
      }
    }
  }
}


export async function listRatingOptions() {
  try {
    const result = await getRatingDefs();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function listGenreOptions() {
  try {
    const result = await getAllGenres();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function listContentWarningOptions() {
  try {
    const result = await getAllContentWarnings();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function updateContentWarnings(
  tenantID: number,
  old,
  update
) {
  try {
    
    let deleteIDs: number[] = [];
    let addIDs: number[] = [];

    if (!old && update.length > 0) {
      addIDs = update;
    } else {
      for (let id of old) {
        if (!update.includes(id)) {
          deleteIDs.push(id);
        }
      }
       for (let id of update) {
        if (!old.includes(id)) {
          addIDs.push(id);
        }
      }
    }

    if (addIDs.length > 0) {
      await addContentWarningsToComic(tenantID, addIDs);
    }
    if (deleteIDs.length > 0) {
      await removeContentWarningsFromComic(tenantID, deleteIDs);
    }

    return {
      success: true,
      data: update,
    };
  } catch (error) {
    return {
      success: false,
      data: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
}

export async function getComicProfile(identifier: string | number) {
  const profile = await selectComicProfile(identifier);
  if (!!profile) {
    return {
      success: true,
      data: profile,
    };
  }
  return {
    success: false,
    error: ErrorKeys.COMIC_INVALID,
  };
}


export async function createComic(fields, userId: number) {
  let profile: Partial<Comic> = {};
  let genres = [];
  let contentWarnings = [];
  try {
    const requiredFields = ["rating", "title", "subdomain"];
    for (let field of requiredFields) {
      if (!fields[field]) {
        throw new Error(GeneralErrorKeys.INVALID_REQUEST)
      }
    }

    profile = await prepareComicProfile(fields);

    
    const newComicID = await createComicWithRelations(profile, userId);
    return {
      success: true,
      data: { newComicID },
    };

  } catch (error: any) {
    if (error.code === "23505") {
      const errorKey =
        error.constraint === "comics_title_key"
          ? ErrorKeys.TITLE_TAKEN
          : ErrorKeys.SUBDOMAIN_TAKEN;
      return {
        success: false,
        error: errorKey,
      };
    }
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
}
