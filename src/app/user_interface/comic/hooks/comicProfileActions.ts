import axios from 'axios';
import { ComicProfileState, ComicData } from '../types';
import { ComicProfileAction } from './comicProfileReducer';

const handleError = function(error:any) {
  // TODO- error logging and such, in the meantime handleError is called in each action
  // for future convenience
  console.error(error)
}

export const fetchProfile = (comicID: number) => async(dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const comic = await axios.get(`/api/comic/${comicID}`);
      dispatch({
        type: 'GET_COMIC_PROFILE',
        payload: { profile: comic.data },
    });
  } catch (error: any ) {
    handleError(error)
  }
};

export const fetchPermissions = (comicID: number) => async(dispatch: React.Dispatch<ComicProfileAction>) => {
  try {
    const permissions = await axios.get(`/api/comic/${comicID}/permissions`);
    dispatch({
      type: 'GET_COMIC_PERMISSIONS',
      payload: { permissions: permissions.data },
    });
  }
  catch (error: any) {
    handleError(error)
  }
}

export const fetchProfileToUpdate = (comicID: number) => async(dispatch: React.Dispatch<ComicProfileAction>) => {
    try {
      const comic = await axios.get(`/api/comic/${comicID}`);
      const permissions = await axios.get(`/api/comic/${comicID}/permissions`);
      if (permissions.data?.edit) {
        dispatch({
          type: 'GET_COMIC_PROFILE_TO_UPDATE',
          payload: { profile: comic.data }
        })
      }
    } catch (error: any ) {
      handleError(error)
    }
};