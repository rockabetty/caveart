import { ComicData, ComicPermissions, ContentWarningUserSelection, GenreUserSelection } from "../types";

export type ComicProfileState = {
  profile: ComicData;
  update: ComicData;
  editing: boolean;
  permissions: ComicPermissions | undefined;
  submissionError?: string;
  successMessage?: string;
  redirect?: string
  loading: boolean;
};

const emptyProfile: ComicData = {
  id: "",
  genres: {},
  content_warnings: {},
  title: "",
  description: "",
  subdomain: "",
  rating: "All Ages",
  thumbnail: undefined,
  likes: true,
  comments: 'Allowed',
  visibility: 'Public'
};

export const initialState: ComicProfileState = {
  profile: emptyProfile,
  update: emptyProfile,
  editing: false,
  permissions: undefined,
  submissionError: "",
  successMessage: "",
  redirect: undefined,
  loading: false
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
      fieldName: keyof ComicData,
      value:  string | ContentWarningUserSelection | GenreUserSelection | boolean
    }
  | {
      type: "EDIT_COMIC_RATING",
      payload: { rating: string }
    }
  | { 
      type: "LOADING",
      payload: { loading: boolean } 
    }
  | {
      type: "SERVER_RESPONSE_SUCCESS",
      payload: { successMessage: string }
    }
  | {
      type: "SERVER_RESPONSE_FAILURE",
      payload: { error: string }
    }
  | {
      type: 'EDIT_COMIC_SUCCESS',
      payload: { successMessage: string }
  }
  | {
    type: "RECOMMEND_REDIRECT",
    payload: { redirect: string }
  }
  | {
    type: "DELETE_COMIC"
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
        update: action.payload.update,
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
    case 'SERVER_RESPONSE_FAILURE':
      return {
        ...state,
        submissionError: action.payload.error
      }
    case 'SERVER_RESPONSE_SUCCESS':
      return {
        ...state,
        successMessage: action.payload.successMessage
      }
    case 'RECOMMEND_REDIRECT':
      return {
        ...state,
        redirect: action.payload.redirect
      }
    case "LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'DELETE_COMIC':
      return state;
    default:
      return state;
  }
};
