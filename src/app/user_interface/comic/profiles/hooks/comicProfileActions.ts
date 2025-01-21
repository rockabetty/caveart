import axios from "axios";
import { ComicProfileAction } from "./comicProfileReducer";
import {
  ComicPermissions,
  ComicField,
  GenreUserSelection,
  ContentWarningUserSelection,
} from "../types";
import { uploadToS3 } from "@client-services/uploads";

export const handleError = function (error: any, dispatch: React.Dispatch<ComicProfileAction>) {
  console.error(error);
  const errorMessage =
    error?.response?.data?.error || "unknown";
  handleSubmissionError(errorMessage)(dispatch);
  dispatch({ type: "LOADING", payload: { loading: false } });
};

const createInvalidTenantDispatch = function(action:string): ComicProfileAction {
  return {
      type: "SERVER_RESPONSE_FAILURE",
      payload: { error: `Invalid or missing tenant. Cannot attempt ${action || "requested operation"}` },
    }
}

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
    if (!tenant) {
      dispatch(createInvalidTenantDispatch('GET_COMIC_PROFILE'));
      return;
    }

    dispatch({ type: "LOADING", payload: { loading: true } });
    try {
      const comic = await axios.get(`/api/comic/${tenant}`);
      dispatch({
        type: "GET_COMIC_PROFILE",
        payload: { profile: comic.data },
      });
    } catch (error: any) {
      if (error.response) {
        const { response } = error;

        if (response.status === 400 && response.data?.subdomain) {
          return dispatch({
            type: "RECOMMEND_REDIRECT",
            payload: { redirect: response.data.subdomain },
          });
        }

        dispatch({
          type: "SERVER_RESPONSE_FAILURE",
          payload: { error: response.data?.message || "An error occurred" },
        });
      } else {
        dispatch({
          type: "SERVER_RESPONSE_FAILURE",
          payload: { error: "Network error. Please check your connection." },
        });
      }
    } finally {
      dispatch({ type: "LOADING", payload: { loading: false } });
    }
  };;

// `fetchProfileToUpdate` is used when the user has editing permissions (e.g., comic owner).
export const fetchProfileToUpdate =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
     if (!tenant) {
      dispatch(createInvalidTenantDispatch('GET_COMIC_PROFILE_TO_UPDATE'));
      return;
    }
    
    dispatch({ type: "LOADING", payload: { loading: true } });
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
    } finally {
      dispatch({ type: "LOADING", payload: { loading: false } });
    }
  };

export const fetchPermissions =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
     if (!tenant) {
      dispatch(createInvalidTenantDispatch('GET_COMIC_PERMISSIONS'));
      return;
    }
    
    try {
      const permissions = await axios.get(`/api/comic/${tenant}/permissions`);
      const permissionData: ComicPermissions = permissions.data;
      let { edit } = permissionData;
      if (edit !== true ) {
        edit = false
      }
      dispatch({
        type: "GET_COMIC_PERMISSIONS",
        payload: { permissions: {edit} },
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
      type: "SERVER_RESPONSE_FAILURE",
      payload: {
        error: `comicProfile.errors.${errorMessage ? errorMessage : "unknown"}`,
      },
    });
  };

export const handleEditSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "SERVER_RESPONSE_SUCCESS",
      payload: { successMessage: "comicProfile.editSuccessful" },
    });
  };

export const handleSubmissionSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "SERVER_RESPONSE_SUCCESS",
      payload: { successMessage: "comicProfile.comicCreated" },
    });
  };

export const uploadComicThumbnail =
  (comicID: number, image: File) =>
  async (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({ type: "LOADING", payload: { loading: true } });
    try {
      const uploadUrl = await uploadToS3(image, {tenant: comicID, presignFor: "thumbnail"});
      await axios.put(`/api/comic/${comicID}`, { update: {id: comicID, thumbnail: uploadUrl }});

      dispatch({
        type: "SERVER_RESPONSE_SUCCESS",
        payload: { successMessage: "comicProfile.editSuccessful" },
      });

    } catch (uploadError) {
      console.error(uploadError);
      handleError(uploadError, dispatch);
    } finally {
      dispatch({ type: "LOADING", payload: { loading: false } });
    }
  };
