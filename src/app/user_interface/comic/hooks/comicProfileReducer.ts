import { ComicData } from '../types';

export type ComicProfileState = {
  profile: ComicData;
  update: ComicData;
  editing: boolean;
  canEdit: boolean;
  submissionError: string;
}

const emptyProfile: ComicData = {
    id: '',
    genres: {},
    content_warnings: {},
    title: '',
    description: '',
    subdomain: '',
    rating: '',
    thumbnail: ''
}

export const initialState: ComicProfileState = {
  profile: emptyProfile,
  update: emptyProfile,
  editing: false,
  canEdit: false,
  submissionError: ''
}

// type Action =
//   | { type: 'GET_COMIC_PROFILE', payload: ComicData }
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
  | { type: 'GET_COMIC_PROFILE', payload: ComicData }

export const comicProfileReducer = (state: ComicProfileState, action: ComicProfileAction): ComicProfileState => {
  switch (action.type) {
    case 'GET_COMIC_PROFILE':
      return {
        ...state,
        profile: action.payload.profile, 
      };
    default:
      return state;
  }
}