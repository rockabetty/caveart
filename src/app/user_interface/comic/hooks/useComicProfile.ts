import { useContext } from 'react';
import { ComicProfileContext } from './ComicProfileProvider';
import { getProfile } from './comicProfileActions';

export const useComicProfile = (comicID: number) => {
  const context = useContext(ComicProfileContext);
  if (!context) {
    throw new Error('useComicProfile must be used within a ComicProfileProvider');
  }
  const {
    state,
    dispatch
  } = context;

  const loadProfile = () => {
    getProfile(comicID)(dispatch);
  }

  return {
    state,
    loadProfile,
  };
};