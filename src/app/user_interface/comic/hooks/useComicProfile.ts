import { useContext } from 'react';
import { ComicProfileContext } from './ComicProfileProvider';
import { fetchProfile, fetchProfileToUpdate, fetchPermissions } from './comicProfileActions';

export const useComicProfile = (comicID: number) => {
  const context = useContext(ComicProfileContext);
  if (!context) {
    throw new Error('useComicProfile must be used within a ComicProfileProvider');
  }
  const {
    state,
    dispatch
  } = context;

  const getProfile = () => {
    fetchProfile(comicID)(dispatch);
  }

  const getUserPermissions = () => {
    fetchPermissions(comicID)(dispatch);
  }

  const enableEditing = () => {
    fetchProfileToUpdate(comicID)(dispatch);
  }

  return {
    state,
    getProfile,
    getUserPermissions,
    enableEditing
  };
};