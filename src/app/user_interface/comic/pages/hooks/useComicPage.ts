import { useState } from "react";
import { NewPageSubmission } from "../types";
import { useTranslation } from "react-i18next";
import { uploadToS3 } from "@client-services/uploads"

export function useComicPage(initialState: NewPageSubmission) {
  const [pageForm, setPageForm] = useState<NewPageSubmission>(initialState);
  const [pageFormError, setPageFormError] = useState<string>("");
  const [pageFormSuccess, setPageFormSuccess] = useState<boolean>(false);
  const [pageFormLoading, setPageFormLoading] = useState<boolean>(false);

  const { t } = useTranslation();

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