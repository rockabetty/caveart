import { useState } from "react";
import { NewPageSubmission } from "../types";
import { useTranslation } from "react-i18next";

export function useUploadForm(initialState: NewPageSubmission) {
  const [uploadForm, setUploadForm] = useState<NewPageSubmission>(initialState);
  const [uploadFormError, setUploadFormError] = useState<string>("");
  const [uploadFormSuccess, setUploadFormSuccess] = useState<boolean>(false);
  const [uploadFormLoading, setUploadFormLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  const updateUploadField = (field: keyof NewPageSubmission, value: any) => {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateUploadForm = () => {
    if (uploadForm.imageSource === "url" && !uploadForm.imageUrl) {
      setUploadFormError(t('comicPages.newPage.linkRequiredIfExternal'));
      return false;
    }
    return true;
  };

  const resetUploadForm = (nextPageNumber: number) => {
    setUploadForm({
      ...initialState,
      newPageNumber: nextPageNumber,
      releaseDate: new Date(),
    });
    setUploadFormError("");
    setUploadFormSuccess(false);
    setUploadFormLoading(false);
  };

  return {
    uploadForm,
    updateUploadField,
    validateUploadForm,
    resetUploadForm,
    uploadFormError,
    setUploadFormError,
    uploadFormSuccess,
    setUploadFormSuccess,
    uploadFormLoading,
    setUploadFormLoading,
  };
}