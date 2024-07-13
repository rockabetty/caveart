import React, { createContext, useReducer } from 'react';
import { comicProfileReducer, initialState } from './comicProfileReducer';
import { ComicProfileState, ComicProfileAction } from './comicProfileReducer';

type ComicProfileContextProps = {
  state: ComicProfileState;
  dispatch: React.Dispatch<ComicProfileAction>;
}

export const ComicProfileContext = createContext<ComicProfileContextProps | undefined>();

const ComicProfileProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(comicProfileReducer, initialState);

  return (
    <ComicProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ComicProfileContext.Provider>
  );
};

export default ComicProfileProvider;