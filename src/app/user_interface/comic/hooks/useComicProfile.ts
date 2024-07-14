import { useContext, useEffect } from "react";
import { ComicProfileContext } from "./ComicProfileProvider";
import {
  fetchProfile,
  fetchProfileToUpdate,
  fetchPermissions,
  updateTextfield
} from "./comicProfileActions";

export const useComicProfile = (comicID: number) => {
  const context = useContext(ComicProfileContext);
  if (!context) {
    throw new Error(
      "useComicProfile must be used within a ComicProfileProvider",
    );
  }
  const { state, dispatch } = context;

  useEffect(() => {
    getProfile();
    getUserPermissions();
  }, [comicID]);

  const getProfile = () => {
    if (comicID !== undefined) {
      fetchProfile(comicID)(dispatch);
    }
  };

  const getUserPermissions = () => {
    if (comicID !== undefined) {
      fetchPermissions(comicID)(dispatch);
    }
  };

  const enableEditing = () => {
    if (comicID !== undefined) {
      fetchProfileToUpdate(comicID)(dispatch);
    }
  };

  const setTextField = (key, value) => {
    updateTextfield(key, value)(dispatch);
  };

  return {
    state,
    getProfile,
    getUserPermissions,
    enableEditing,
    setTextField,
  };
};
