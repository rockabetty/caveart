import { useContext, useEffect, useCallback } from "react";
import { ComicProfileContext } from "./ComicProfileProvider";
import {
  fetchProfile,
  fetchProfileToUpdate,
  fetchPermissions,
  updateFormfield,
  updateRating,
  // handleFileChange,
  handleSubmissionError,
  handleSubmissionSuccess,
  handleEditSuccess,
  deleteComic,
  uploadComicThumbnail,
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
    throw new Error(
      "useComicProfile must be used within a ComicProfileProvider",
    );
  }
  const { state, dispatch } = context;

  useEffect(() => {
    getProfile();
    getUserPermissions();
  }, [tenant]);

  const getProfile = useCallback(() => {
    if (tenant) {
      fetchProfile(tenant)(dispatch);
    }
  }, [tenant, dispatch]);

  const getUserPermissions = useCallback(() => {
    if (tenant) {
      fetchPermissions(tenant)(dispatch);
    }
  }, [tenant, dispatch]);

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
    if (state.submissionError) {
      setSubmissionError("");
    }
  };

  const setRating = (contentWarnings: ContentWarningUserSelection) => {
    updateRating(contentWarnings)(dispatch);
  };

  // const setThumbnail = (file: File ) => {
  //   const validTypes = ["image/jpeg", "image/png", "image/gif"];
  //   if (!validTypes.includes(file.type)) {
  //     return setSubmissionError(
  //       "Invalid file type. Only JPG, PNG, and GIF are allowed.",
  //     );
  //   }
  //   if (file.size > 500 * 1024) {
  //     return setSubmissionError("File size exceeds the 500KB limit.");
  //   }
  //   handleFileChange(file)(dispatch);
  // };

  const setSubmissionError = (error: any) => {
    handleSubmissionError(error)(dispatch);
  };

  const uploadThumbnail = async (image: File, comicID) => {
    console.log("Upload TN")
    console.log(comicID)
    if (!comicID) return;
    if (!image) {
      console.log("no image.")
      return setSubmissionError("thumbnailMissing");
    }
    console.log("hi")

    try {
      console.log("time to await")
      const fileUrl = await uploadComicThumbnail(comicID, image)(dispatch);
      dispatch({
        type: "UPLOAD_THUMBNAIL",
        payload: { uploadUrl: fileUrl },
      });
    } catch (error) {
      handleSubmissionError("Failed to upload thumbnail.")(dispatch);
    }
  };

  const confirmCreation = (data: ComicData) => {
    handleSubmissionSuccess()(dispatch);
    router.push(`/comic/${data.id}`);
  };

  const confirmEdit = () => {
    handleEditSuccess()(dispatch);
    getProfile();
  };

  const removeComic = (comicID: number) => {
    deleteComic(comicID)(dispatch);
    // router.push(`/comics/mine`);
  };

  return {
    state,
    getProfile,
    getUserPermissions,
    enableEditing,
    setField,
    setRating,
    // setThumbnail,
    setSubmissionError,
    confirmCreation,
    confirmEdit,
    removeComic,
    uploadThumbnail
  };
};
