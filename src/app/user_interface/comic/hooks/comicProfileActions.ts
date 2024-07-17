import axios from "axios";
import { ComicProfileAction } from "./comicProfileReducer";
import { ComicPermissions, ComicData, ComicField, GenreUserSelection, ContentWarningUserSelection } from "../types";

const handleError = function (error: any) {
  // TODO- error logging and such, in the meantime handleError is called in each action
  // for future convenience
  console.error(error);
};

const ratingLevels = {
  "Ages 10+": new Set([
    "someViolence",
    "someSuggestiveContent"
  ]),
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
    "frequentHardDrugUse"
  ])
};

// isDisjointFrom is brand new so here's one that typescript won't sneer at
const isDisjointFrom = (setA: Set<string>, setB: Set<string>): boolean => {
   // @ts-ignore: 2802
  for (let elem of setA) {
    if (setB.has(elem)) {
      return false;
    }
  }
  return true;
};

const determineComicRating = function(selection: ContentWarningUserSelection) {
  const warningsChosen: string[] = [];
  Object.keys(selection).forEach((warning) => {
    warningsChosen.push(selection[warning]['name']);
  })
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
  return 'All Ages';
}

export const fetchProfile =
  (comicID: number) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const comic = await axios.get(`/api/comic/${comicID}`);
      dispatch({
        type: "GET_COMIC_PROFILE",
        payload: { profile: comic.data },
      });
    } catch (error: any) {
      handleError(error);
    }
  };

export const fetchPermissions =
  (comicID: number) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const permissions = await axios.get(`/api/comic/${comicID}/permissions`);
      const permissionData: ComicPermissions = permissions.data;
      dispatch({
        type: "GET_COMIC_PERMISSIONS",
        payload: { permissions: permissionData },
      });
    } catch (error: any) {
      handleError(error);
    }
  };

export const fetchProfileToUpdate = (comicID: number) => async (dispatch: React.Dispatch<ComicProfileAction>) => {
  try {
    const [comic, permissions] = await Promise.all([
      axios.get(`/api/comic/${comicID}`),
      axios.get(`/api/comic/${comicID}/permissions`)
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
  (fieldName: ComicField, value: string | ContentWarningUserSelection | GenreUserSelection) =>
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
        rating
      }
    })
  };

export const handleFileChange = 
  (file: File) =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({ type: 'SET_COVER_IMAGE', file });
  };

export const handleSubmissionError = 
  (errorMessage) =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: 'CREATE-UPDATE_NEW_COMIC_FAILURE',
      payload: { error: errorMessage ? `comicManagement.errors.${errorMessage}` : '' }
    });
  };

export const handleEditSuccess = () =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: "EDIT_COMIC_SUCCESS",
      payload: { successMessage: "comicManagement.editSuccessful" }
    })
  }

export const handleSubmissionSuccess = 
  (errorMessage) =>
  (dispatch: React.Dispatch<ComicProfileAction>) => {
    dispatch({
      type: 'CREATE-UPDATE_NEW_COMIC_SUCCESS'
    });
  };

