import { useState } from "react";
import { NewPageSubmission } from "../types";
import { useTranslation } from "react-i18next";
import { uploadToS3 } from "@client-services/uploads";
import { ComicPage } from '../types';
import axios from 'axios';

export function useComicPage(initialState: NewPageSubmission) {
  const [pageForm, setPageForm] = useState<NewPageSubmission>(initialState);
  const [pageFormError, setPageFormError] = useState<string>("");
  const [pageFormSuccess, setPageFormSuccess] = useState<boolean>(false);
  const [pageFormLoading, setPageFormLoading] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState<number>(0);
  const [comicPageError, setComicPageError] = useState<string>("");
  const [comicPageData, setComicPageData] = useState<ComicPage>({});

  const { t } = useTranslation();

  const getComicPage = async (tenant: string, number: number) => {
    try {
      const comicPageRequest = await axios.get(`/api/comic/{tenant}/page`, {number})
      setComicPageData(comicPageRequest.data)
    } catch {
      setComicPageError("Couldn't fetch page")
    }
  }

  const updatePageField = (field: keyof NewPageSubmission, value: any) => {
    setPageForm((prev) => ({ ...prev, [field]: value }));
  };

  const validatePageForm = () => {
    if (pageForm.imageSource === "url" && !pageForm.imageUrl) {
      setPageFormError(t('comicPages.newPage.linkRequiredIfExternal'));
      return false;
    }
    return true;
  };

   const uploadComicPage = async (tenant: string) => {
    if (!pageForm.image) return setPageFormError("No image to upload.");
    try {
      return await uploadToS3(pageForm.image, tenant, "comic page");
    } catch (uploadError) {
      console.error(uploadError);
      setPageFormError("Failed to upload image.");
    }
  };

  const resetPageForm = (nextPageNumber: number) => {
    setPageForm({
      ...initialState,
      newPageNumber: nextPageNumber,
      releaseDate: new Date(),
    });
    setPageFormError("");
    setPageFormSuccess(false);
    setPageFormLoading(false);
  };

  return {
    comicPageData,
    pageForm,
    updatePageField,
    validatePageForm,
    resetPageForm,
    pageFormError,
    setPageFormError,
    pageFormSuccess,
    setPageFormSuccess,
    pageFormLoading,
    setPageFormLoading,
    uploadComicPage
  };
}