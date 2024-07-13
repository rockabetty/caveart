import { ComicData } from './comicProfileReducer';
import axios from 'axios';

export const loadProfile = async function (comicID: number, dispatch: React.Dispatch<Action>): ComicData {
  try {
    const comic = await axios.get(`/api/comic/${comicID}`);
    const permissions = await axios.get(`/api/comic/${comicID}/permissions`);
    dispatch({
      type: 'LOAD_DATA',
      payload: { comicProfile: comicResponse.data, canEdit: permissionResponse.data?.edit },
    });
  } catch (error: any ) {
    console.error(error)
  }
}