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
  handleSubmissionSuccess,
  handleEditSuccess,
} from "./comicProfileActions";
import {
  ComicData,
  ContentWarningUserSelection,
  GenreUserSelection,
} from "../types";
import { useRouter } from "next/router";

export const useComicProfile = (tenant?: string) => {
  const router = useRouter();
  const context = useContext(ComicProfileContext);
  if (!context) {
    throw new Error("useComicProfile must be used within a ComicProfileProvider");
  }
  const { state, dispatch } = context;

  useEffect(() => {
    if (tenant !== undefined) {
      getProfile();
      getUserPermissions();
    }
  }, [tenant]);

  const getProfile = () => {
    if (!!tenant) {
      fetchProfile(tenant)(dispatch);
    }
  };

  const getUserPermissions = () => {
    if (!!tenant) {
      fetchPermissions(tenant)(dispatch);
    }
  };

  const enableEditing = () => {
    if (!!tenant) {
      fetchProfileToUpdate(tenant)(dispatch);
    }
  };

  const setField = (
    key: keyof ComicData,
    value: string | ContentWarningUserSelection | GenreUserSelection | boolean,
  ) => {
    updateFormfield(key, value)(dispatch);
    setSubmissionError('');
  };

  const setRating = (contentWarnings: ContentWarningUserSelection) => {
    updateRating(contentWarnings)(dispatch);
  };

  const setThumbnail = (file: File | FileList) => {
    handleFileChange(file)(dispatch);
  };

  const setSubmissionError = (error: any) => {
    handleSubmissionError(error)(dispatch);
  };

  const confirmCreation = (data: ComicData) => {
    handleSubmissionSuccess()(dispatch);
    router.push(`/comic/${data.id}`);
  };

  const confirmEdit = () => {
    handleEditSuccess()(dispatch);
    getProfile();
  };

  return {
    state,
    getProfile,
    getUserPermissions,
    enableEditing,
    setField,
    setRating,
    setThumbnail,
    setSubmissionError,
    confirmCreation,
    confirmEdit,
  };
};