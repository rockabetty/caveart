import axios from "axios";
import { ComicProfileAction } from "./comicProfileReducer";
import {
  ComicPermissions,
  ComicData,
  ComicField,
  GenreUserSelection,
  ContentWarningUserSelection,
} from "../types";

const handleError = function (error: any) {
  // TODO- error logging and such, in the meantime handleError is called in each action
  // for future convenience
  console.error(error);
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

// isDisjointFrom is brand new so here's one that typescript won't sneer at
const isDisjointFrom = (setA: Set<string>, setB: Set<string>) => {
  for (let elem of setA) {
    if (setB.has(elem)) {
      return false;
    }
  }
  return true;
};

const determineComicRating = function (
  selection: Readonly<ContentWarningUserSelection>,
): string {
  const warningsChosen: string[] = [];
  Object.keys(selection).forEach((warning) => {
    warningsChosen.push(selection[warning]["name"]);
  });
  const content = new Set(warningsChosen);
  if (!isDisjointFrom(content, ratingLevels["Adults Only (18+)"])) {
    return "Adults Only (18+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Mature (17+)"])) {
    return "Mature (17+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Teen (13+)"])) {
    return "Teen (13+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Ages 10+"])) {
    return "Ages 10+";
  }
  return "All Ages";
};

export const deleteComic = (comicID: number) => async(dispatch: React.Dispatch<ComicProfileAction>) => {
  try {
    axios.post(`/api/comic/${comicID}/delete`);
    dispatch({
      type: "DELETE_COMIC"
    })
  } catch (error: any) {
    handleError(error);
  }
};

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
        if (response.status === 400 ) {
          if (!!response.data.subdomain) {
            return dispatch({
              type: "RECOMMEND_REDIRECT",
              payload: { tenant: response.data.subdomain }
            })
          }
        }
        handleError(error);
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
      handleError(error);
    }
  };

export const fetchProfileToUpdate =
  (tenant: string) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    console.log("Fetch profile to update with tenant  -" + tenant)
    try {
      const [comic, permissions] = await Promise.all([
        axios.get(`/api/comic/${tenant}`),
        axios.get(`/api/comic/${tenant}/permissions`),
      ]);

      if (permissions.data?.edit) {
        dispatch({
          type: "GET_COMIC_PROFILE_TO_UPDATE",
          payload: {
            profile: comic.data as ComicData,
            update: JSON.parse(JSON.stringify(comic.data)) as ComicData,
          },
        });
      }
    } catch (error: any) {
      handleError(error);
    }
  };

export const updateFormfield =
  (
    fieldName: ComicField,
    value:
      | string
      | Readonly<ContentWarningUserSelection>
      | Readonly<GenreUserSelection>
      | boolean,
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

export const handleFileChange =
  (file: File | FileList) => (dispatch: React.Dispatch<ComicProfileAction>) => {
    const selectedFile = file instanceof FileList ? file[0] : file;
    if (!selectedFile) return;
    dispatch({ type: "SET_COVER_IMAGE", file: selectedFile });
  };

export const handleSubmissionError =
  (errorMessage: string) => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_FAILURE",
      payload: {
        error: errorMessage ? `comicManagement.errors.${errorMessage}` : "",
      },
    });
  };

export const handleEditSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_SUCCESS",
      payload: { successMessage: "comicManagement.editSuccessful" },
    });
  };

export const handleSubmissionSuccess =
  () => (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "CREATE_OR_EDIT_COMIC_SUCCESS",
      payload: { successMessage: "comicManagement.comicCreated" },
    });
  };
