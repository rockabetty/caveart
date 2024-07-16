import { useContext, useEffect } from "react";
import { ComicProfileContext } from "./ComicProfileProvider";
import {
  fetchProfile,
  fetchProfileToUpdate,
  fetchPermissions,
  updateFormfield,
  updateRating,
  handleFileChange,
  handleSubmissionError,
  handleSubmissionSuccess
} from "./comicProfileActions";
import {
  ComicData,
  ContentWarningUserSelection,
  GenreUserSelection,
} from "../types";
import { useRouter } from 'next/router';

export const useComicProfile = (comicID?: number) => {
  const router = useRouter();
  const context = useContext(ComicProfileContext);
  if (!context) {
    throw new Error(
      "useComicProfile must be used within a ComicProfileProvider",
    );
  }
  const { state, dispatch } = context;

  useEffect(() => {
    if (comicID !== undefined) {
      getProfile();
      getUserPermissions();
    }
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

  const setField = (
    key: keyof ComicData,
    value: string | ContentWarningUserSelection | GenreUserSelection,
  ) => {
    updateFormfield(key, value)(dispatch);
    setSubmissionError('')
  };

  const setRating = (contentWarnings: ContentWarningUserSelection) => {
    updateRating(contentWarnings)(dispatch);
  };

  const setThumbnail = (file: File) => {
    handleFileChange(file)(dispatch)
  }

  const setSubmissionError = (error: any ) => {
    handleSubmissionError(error)(dispatch)
  }

  const confirmCreation = (data: ComicData) => {
    handleSubmissionSuccess()(dispatch)
    router.push(`/comic/${data.id}`)
  }

  return {
    state,
    getProfile,
    getUserPermissions,
    enableEditing,
    setField,
    setRating,
    setThumbnail,
    setSubmissionError,
    confirmCreation
  };
};
