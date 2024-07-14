import React, { createContext, useReducer } from 'react';
import { comicProfileReducer, initialState } from './comicProfileReducer';
import { ComicProfileState, ComicProfileAction } from './comicProfileReducer';

type ComicProfileContextProps = {
  state: ComicProfileState;
  dispatch: React.Dispatch<ComicProfileAction>;
}

export const ComicProfileContext = createContext<ComicProfileContextProps | undefined>(undefined);

type ComicProfileProviderProps = {
  children: React.ReactNode;
}

const ComicProfileProvider = ( props: ComicProfileProviderProps ) => {
  const {children} = props;
  const [state, dispatch] = useReducer(comicProfileReducer, initialState);

  return (
    <ComicProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ComicProfileContext.Provider>
  );
};

export default ComicProfileProvider;