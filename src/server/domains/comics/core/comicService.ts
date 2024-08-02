import {
  isAuthor,
  getRatingId,
  addAuthorToComic,
  getAllGenres,
  getRatingDefs,
  addGenresToComic,
  removeGenresFromComic,
  removeContentWarningsFromComic,
  addContentWarningsToComic,
  getAllContentWarnings,
  getComicIdFromSubdomain,
  addComic,
  editComic as editComicTable,
  selectComicProfile
} from "../outbound/comicRepository";
import { sanitizeLongformText } from "@services/sanitizers"
import logger from "@logger";
import extractUserIdFromToken from "@domains/users/utils/extractUserIdFromToken";
import formidable from "formidable";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as GeneralErrorKeys } from '../../../errors.types'
import { ErrorKeys as FileErrorKeys } from '@services/uploader/errors.types'
import { addComicImageToDatabase } from '@services/uploader'

const invalidRequest = {
  success: false,
  error: GeneralErrorKeys.INVALID_REQUEST,
};

export async function canEditComic(
  userID: number,
  tenant: number | string,
) {
  try {
    let comicID = tenant;
    if (typeof tenant  !== 'number' ) {
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

export async function editComic(
  tenant: number | string,
  update: Comic,
): Promise<QueryResult | null> {
  try {
    let columnName = "id";
    if (typeof tenant === "string") {
      columnName = "subdomain"
    }
    const edit = await editComicTable(tenant, update);
    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error
    };
  }
}

const isValidRating = async function (rating:string) {
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

export const isValidSubdomain = function(rawSubdomain) {
  const subdomain = rawSubdomain.toLowerCase();
  const subdomainFilter = /^(?!-)(?!.*--)[a-z0-9-]{1,63}(?<!-)$/;
  return subdomainFilter.test(subdomain)
}

const isValidIDList = function (list: number[]) {
  if (list === undefined) {
    return true
  }
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

export const isValidDescription = function (description: string) {
  return description.length < 1024; 
}

export const isValidCommentOption = function (option: string) {
  const validComments = ["Allowed", "Moderated", "Disabled"];
  return validComments.includes(option);
} 

export const isValidVisibilityOption = function (option: string) {
  const validVisibilities = ["Public", "Unlisted", "Invite-Only"];
  return validVisibilities.includes(option)
}

export const isValidLikesOption = function (option: "true" | "false" | boolean) {
  if (option !== "true" && option !== "false") {
    return typeof option === 'boolean'
  }
  return true
}

export const isValidTitle = function (title: string) {
  if (title.length > 120) {
    return false
  }

  const validTitleRegex = /^[a-zA-Z0-9\s.,!?'"-_]{1,120}$/;
  if (!validTitleRegex.test(title)) {
    return false
  }
  return true
}

export async function updateTitle (
  tenantID: number,
  update: string
  ): Promise<QueryResult | null > {
    if (isValidTitle(update)) {
      const updateData = { 'title': update }
      try {
        editComic(tenantID, updateData)
        return {
          success: true,
          data: updateData
        }
      } catch (error) {
        if (error.code && error.code === '23505') {
          return { 
            success: false,
            error: ErrorKeys.TITLE_TAKEN
          }
        }
        return {
          success: false,
          error: error
        }
      }
    }
    return invalidRequest
}

export async function updateSubdomain (
  tenantID: number,
  update: string
  ): Promise<QueryResult | null > {
    if (isValidSubdomain(update)) {
      const updateData = { 'subdomain': update }
      try {
        editComic(tenantID, updateData)
        return {
          success: true,
          data: updateData
        }
      } catch (error) {
        if (error.code && error.code === '23505') {
          return { 
            success: false,
            error: ErrorKeys.SUBDOMAIN_TAKEN
          }
        }
        return {
          success: false,
          error: error
        }
      }
    }
    return invalidRequest
}

export async function updateDescription (
  tenantID: number,
  update: string
  ): Promise<QueryResult | null > {
    if (isValidDescription(update)) {
      const sanitizedInput = sanitizeLongformText(update)
      const updateData = { 'description': sanitizedInput }
      try {
        editComic(tenantID, updateData)
        return {
          success: true,
          data: updateData
        }
      } catch (error) {
        return {
          success: false,
          error: error
        }
      }
    }
    return invalidRequest
}

export async function updateGenres (
  tenantID: number,
  old,
  update ) {
    if (typeof old !== "object" || typeof update !== "object") {
      return invalidRequest
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
        data: update
      }
    } catch (error) {
        return {
          success: false,
          error: error
        }
    }
}

export async function listRatingOptions() {
    try {
    const result = await getRatingDefs()
    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    return {
      success: false,
      error: error
    }  
  }
}

export async function listGenreOptions () {
  try {
    const result = await getAllGenres()
    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    return {
      success: false,
      error: error
    }  
  }
}

export async function listContentWarningOptions () {
  try {
    const result = await getAllContentWarnings()
    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    return {
      success: false,
      error: error
    }  
  }
}

export async function updateContentWarnings (
  tenantID: number,
  old,
  update,
  rating
  ) {
  try {
    let oldIDs = [];
    let newIDs = [];
    for (let key in old) {
      oldIDs.push(Number(old[key].id))
    }
    for (let key in update) {
      newIDs.push(Number(update[key].id))
    }

    let deleteIDs: number[] = [];
    let addIDs: number[] = [];

    for (let id of oldIDs) {
      if (!newIDs.includes(id)) {
        deleteIDs.push(id);
      }
    }

    for (let id of newIDs) {
      if (!oldIDs.includes(id)) {
        addIDs.push(id);
      }
    }

    if (addIDs.length > 0) {
      await addContentWarningsToComic(tenantID, addIDs);
    }
    if (deleteIDs.length > 0) {
      await removeContentWarningsFromComic(tenantID, deleteIDs);
    }

    const ratingId = await getRatingId(rating);
    await editComic(tenantID, { rating: ratingId });
    return {
      success: true,
      data: update
    }
  } catch (error) {
    return {
      success: false,
      data: ErrorKeys.GENERAL_SERVER_ERROR
    }
  }
}

export async function getComicProfile(identifier: string | number) {
  const profile = await selectComicProfile(identifier);
  if (!!profile) {
    return {
      success: true,
      data: profile
    }
  }
  return {
    success: false,
    error: ErrorKeys.COMIC_INVALID
  }
}

export async function updateThumbnail(comicID: number, files: formidable.Files) {
  let thumbnail_id = undefined;
  if (files) {
    try {
      await Promise.all(
        Object.keys(files).map(async (key) => {
          const file = files[key][0];
          thumbnail_id = await addComicImageToDatabase(`/uploads/${file.newFilename}`);
        })
      );
      const update = await editComic(comicID, { thumbnail_id })
      return {
        success: true,
        data: { thumbnail_id }
      }
    } catch (fileErr) {
      return {
        success: false,
        error: fileErr
      };
    }
  }
  return {
    success: false,
    error: FileErrorKeys.IMAGE_MISSING
  }
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

  profile.title = fields.title[0].trim().replace(/\s+/g, ' ');
 
  const subdomain = fields.subdomain[0].toLowerCase();
  if (!isValidSubdomain(subdomain)) {
    return invalidRequest;
  }
  profile.subdomain = subdomain;

  const rating = fields.rating[0];
  if (!isValidRating(rating)) {
   return invalidRequest;
  }
  const ratingId = await getRatingId(rating);
  profile.rating = ratingId;

  const description = fields.description[0];
  if (!isValidDescription) {
    return invalidRequest;
  }
  const sanitizedInput = sanitizeLongformText(description)
  profile.description = sanitizedInput;

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
          const upload = await addComicImageToDatabase(`/uploads/${file.newFilename}`);
          profile.thumbnail_id = upload;
        })
      );
    } catch (fileErr) {
      return {
        success: false,
        error: FileErrorKeys.FILE_UPLOAD_ERROR,
      };
    }
  }

  try {
    const id = await addComic(profile);
    if (id) {
      await addAuthorToComic(id, userId);
  
      if (profile.genres?.length > 0) {
        await addGenresToComic(id, profile.genres);
      }

      if (profile.content?.length > 0) {
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