export type Genre = {
  id: string;
  name: string;
  description?: string;
}

export type GenreUserSelection = {
  [key: `${number}` | number]: Genre
}

export type ContentWarningUserSelection = {
  [contentWarningName: string]: string | number;
};

export type ComicData = {
  id: string;
  genres: GenreUserSelection;
  content_warnings: 
  description: string;
  title: string;
  subdomain: string;
  thumbnail: string;
  rating: string;
}

export type ComicTextInputField = Extract<keyof ComicData, 'title' | 'description' | 'subdomain'>;

type ComicProfileState = {
  profile: ComicData;
  update: ComicData;
  editing: boolean;
  submissionError: string;
}

const emptyProfile: ComicProfileState = {
  id: '',
  genres: {},
  content_warnings: {},
  title: '',
  description: '',
  subdomain: '',
  rating: '',
  thumbnail: ''
}

type Action =
  | { type: 'SET_COMIC_PROFILE', payload: ComicData }
  | { type: 'SET_COMIC_UPDATE', payload: ComicData }
  | { type: 'SET_EDITING', payload: boolean }
  | { type: 'SET_CAN_EDIT', payload: boolean }
  | { type: 'SET_SUBMISSION_ERROR', payload: string }
  | { type: 'RESET_UPDATE' }
  | { type: 'START_EDIT' }
  | { type: 'CANCEL_EDIT' }
  | { type: 'UPDATE_GENRE', payload: GenreUserSelection }
  | { type: 'UPDATE_TEXT', payload: { key: ComicTextInputField, value: string } }
  | { type: 'UPDATE_FILE', payload: string }
  | { type: 'UPDATE_CONTENT_WARNINGS', payload: { current: ContentWarningUserSelection, update: ContentWarningUserSelection } };

const comicProfileReducer = (state: ComicProfileState, action: Action): ComicProfileState => {
  switch (action.type) {
    case 'SET_COMIC_PROFILE':
      return {
        ...state,
        profile: action.payload.comicProfile, 
        update: action.payload.comicProfile, 
        canEdit: action.payload.canEdit 
      };
    default:
      return state;
  }
}

export default comicProfileReducer;