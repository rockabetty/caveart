import { ComicData, ComicPermissions } from "../types";

export type ComicProfileState = {
  profile: ComicData;
  update: ComicData;
  editing: boolean;
  permissions: ComicPermissions;
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
};

export const initialState: ComicProfileState = {
  profile: emptyProfile,
  update: emptyProfile,
  editing: false,
  canEdit: false,
  submissionError: "",
};

// type Action =
//   | { type: 'SET_COMIC_UPDATE', payload: ComicData }
//   | { type: 'SET_EDITING', payload: boolean }
//   | { type: 'SET_CAN_EDIT', payload: boolean }
//   | { type: 'SET_SUBMISSION_ERROR', payload: string }
//   | { type: 'RESET_UPDATE' }
//   | { type: 'START_EDIT' }
//   | { type: 'CANCEL_EDIT' }
//   | { type: 'UPDATE_GENRE', payload: GenreUserSelection }
//   | { type: 'UPDATE_TEXT', payload: { key: ComicTextInputField, value: string } }
//   | { type: 'UPDATE_FILE', payload: string }
//   | { type: 'UPDATE_CONTENT_WARNINGS', payload: { current: ContentWarningUserSelection, update: ContentWarningUserSelection } };

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
      type: "EDIT_TEXT_FIELD",
      fieldName: string,
      value: string
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
    case "EDIT_TEXT_FIELD":
      return {
        ...state,
        update: {
          ...state.update,
          [action.fieldName]: action.value 
        }
      }
    default:
      return state;
  }
};
