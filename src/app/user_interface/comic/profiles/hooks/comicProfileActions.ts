import axios from "axios";
import { ComicProfileAction } from "./comicProfileReducer";
import {
  ComicPermissions,
  ComicData,
  ComicField,
  GenreUserSelection,
  ContentWarningUserSelection,
} from "../types";
import { uploadToS3 } from "@client-services/uploads";

const handleError = function (error: any, dispatch: React.Dispatch<ComicProfileAction>) {
  console.error(error);
  const errorMessage =
    error?.response?.data?.error || "An unknown error occurred.";
  handleSubmissionError(errorMessage)(dispatch);
};

const ratingLevels = {
  "Ages 10+": new Set(["someViolence", "someSuggestiveContent"]),
  "Teen (13+)": new Set([
    "frequentSuggestiveContent",
    "someBlood",
    "someRealisticInjuries",
    "frequentViolence",
    "someThreats",
    "someSwearing",
    "someSlurs",
    "someSexualLanguage",
    "someReferencesToSubstances",
    "someAlcoholUse",
    "someCommonDrugUse",
    "somePartialNudity",
  ]),
  "Mature (17+)": new Set([
    "frequentRealisticInjuries",
    "frequentBlood",
    "someGore",
    "frequentPartialNudity",
    "someFullNudity",
    "someSexScenes",
    "frequentThreats",
    "frequentSwearing",
    "frequentSlurs",
    "frequentRealisticInjuries",
    "frequentSexualLanguage",
    "frequentReferencesToSubstances",
    "frequentAlcoholUse",
    "someHardDrugUse",
    "someSexualViolence",
  ]),
  "Adults Only (18+)": new Set([
    "frequentGore",
    "frequentFullNudity",
    "frequentSexScenes",
    "frequentSexualViolence",
    "frequentHardDrugUse",
  ]),
};

const determineComicRating = (
  selection: Readonly<ContentWarningUserSelection>,
): string => {
  const warningsChosen = Object.values(selection).map(
    (warning) => warning.name,
  );
  const content = new Set(warningsChosen);

  if (
    Array.from(ratingLevels["Adults Only (18+)"]).some((warning) =>
      content.has(warning),
    )
  ) {
    return "Adults Only (18+)";
  }
  if (
    Array.from(ratingLevels["Mature (17+)"]).some((warning) =>
      content.has(warning),
    )
  ) {
    return "Mature (17+)";
  }
  if (
    Array.from(ratingLevels["Teen (13+)"]).some((warning) =>
      content.has(warning),
    )
  ) {
    return "Teen (13+)";
  }
  if (
    Array.from(ratingLevels["Ages 10+"]).some((warning) => content.has(warning))
  ) {
    return "Ages 10+";
  }
  return "All Ages";
};

export const deleteComic =
  (comicID: number) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      axios.post(`/api/comic/${comicID}/delete`);
      dispatch({
        type: "DELETE_COMIC",
      });
    } catch (error: any) {
      handleError(error, dispatch);
    }
  };

// `fetchProfile` is used for general viewing (read-only access).
export const fetchProfile =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const comic = await axios.get(`/api/comic/${tenant}`);
      dispatch({
        type: "GET_COMIC_PROFILE",
        payload: { profile: comic.data },
      });
    } catch (error: any) {
      const { response } = error;
      if (response.status === 400) {
        if (!!response.data.subdomain) {
          return dispatch({
            type: "RECOMMEND_REDIRECT",
            payload: { tenant: response.data.subdomain },
          });
        }
      }
      handleError(error, dispatch);
    }
  };

// `fetchProfileToUpdate` is used when the user has editing permissions (e.g., comic owner).
export const fetchProfileToUpdate =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const permissions = await axios.get(`/api/comic/${tenant}/permissions`);
      if (!permissions.data?.edit) return;

      const comic = await axios.get(`/api/comic/${tenant}`);
      dispatch({
        type: "GET_COMIC_PROFILE_TO_UPDATE",
        payload: {
          profile: comic.data,
          update: JSON.parse(JSON.stringify(comic.data)),
        },
      });
    } catch (error: any) {
      handleError(error, dispatch);
    }
  };

export const fetchPermissions =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const permissions = await axios.get(`/api/comic/${tenant}/permissions`);
      const permissionData: ComicPermissions = permissions.data;
      dispatch({
        type: "GET_COMIC_PERMISSIONS",
        payload: { permissions: permissionData },
      });
    } catch (error: any) {
      handleError(error, dispatch);
    }
  };

export const updateFormfield =
  (
    fieldName: ComicField,
    value:
      | string
      | Readonly<ContentWarningUserSelection>
      | Readonly<GenreUserSelection>
      | boolean
      | File
  ) =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "EDIT_FORM_FIELD",
      fieldName,
      value,
    });
  };

export const updateRating =
  (contentWarnings: ContentWarningUserSelection) =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    const rating = determineComicRating(contentWarnings);
    dispatch({
      type: "EDIT_COMIC_RATING",
      payload: {
        rating,
      },
    });
  };

export const handleSubmissionError =
  (errorMessage: string) => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_FAILURE",
      payload: {
        error: errorMessage ? `comicProfile.errors.${errorMessage}` : "",
      },
    });
  };

export const handleEditSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_SUCCESS",
      payload: { successMessage: "comicProfile.editSuccessful" },
    });
  };

export const handleSubmissionSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_SUCCESS",
      payload: { successMessage: "comicProfile.comicCreated" },
    });
  };

export const uploadComicThumbnail =
  (tenant: string, image: File) =>
  async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const uploadUrl = await uploadToS3(image, tenant, "thumbnail");
      await axios.post(`/api/comic/${tenant}/thumbnail`, { tenant, uploadUrl });

      dispatch({
        type: "CREATE_OR_EDIT_COMIC_SUCCESS",
        payload: { successMessage: "comicProfile.editSuccessful" },
      });

    } catch (uploadError) {
      console.error(uploadError);
      handleError(uploadError, dispatch);
    }
  };
