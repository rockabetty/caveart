import axios from 'axios';
import { ComicProfileState, Action, ComicData } from '../types';

export const getProfile = (comicID: number) => async(dispatch: React.Dispatch<Action>) => {
    try {
      const comic = await axios.get(`/api/comic/${comicID}`);
      dispatch({
        type: 'GET_COMIC_PROFILE',
        payload: { profile: comic.data },
    });
  } catch (error: any ) {
    console.error(error)
  }
};