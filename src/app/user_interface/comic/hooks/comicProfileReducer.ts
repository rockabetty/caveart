import { ComicData, ComicPermissions, GenreUserSelection } from "../types";

export type ComicProfileState = {
  profile: ComicData;
  update: ComicData;
  editing: boolean;
  permissions: ComicPermissions | undefined;
  submissionError: string;
};

const emptyProfile: ComicData = {
  id: "",
  genres: {},
  content_warnings: {},
  title: "",
  description: "",
  subdomain: "",
  rating: "",
  thumbnail: "",
  likes: true,
  comments: true,
  moderate_comments: false,
  is_unlisted: false,
  is_private: false
};

export const initialState: ComicProfileState = {
  profile: emptyProfile,
  update: emptyProfile,
  editing: false,
  permissions: undefined,
  submissionError: "",
};

export type ComicProfileAction =
  | { 
      type: "GET_COMIC_PROFILE",
      payload: { profile: ComicData } }
  | {
      type: "GET_COMIC_PERMISSIONS",
      payload: { permissions: ComicPermissions };
    }
  | {
      type: "GET_COMIC_PROFILE_TO_UPDATE",
      payload: { profile: ComicData; update: ComicData };
    }
  | {
      type: "EDIT_FORM_FIELD",
      fieldName: string,
      value: string | GenreUserSelection
    }
  | {
      type: "EDIT_COMIC_RATING",
      payload: { rating: string }
    }

export const comicProfileReducer = (
  state: ComicProfileState,
  action: ComicProfileAction,
): ComicProfileState => {
  switch (action.type) {
    case "GET_COMIC_PROFILE":
      return {
        ...state,
        profile: action.payload.profile,
      };
    case "GET_COMIC_PERMISSIONS":
      return {
        ...state,
        permissions: action.payload.permissions,
      };
    case "GET_COMIC_PROFILE_TO_UPDATE":
      return {
        ...state,
        profile: action.payload.profile,
        update: action.payload.profile,
      };
    case "EDIT_FORM_FIELD":
      return {
        ...state,
        update: {
          ...state.update,
          [action.fieldName]: action.value 
        }
      }
    case "EDIT_COMIC_RATING":
      return {
        ...state,
        update: {
          ...state.update,
          rating: action.payload.rating
        }
      }
    default:
      return state;
  }
};
