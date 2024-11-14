import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CaveartLayout from "@features/CaveartLayout";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { Button, Form, ImageUpload, Link, TextArea } from "@components";
import DateTimepicker from "@components/Form/DateTimepicker";
import { NewPageSubmission } from '@features/comic/pages';
import { useUploadForm } from "@features/comic/pages/hooks/useUploadForm";


function AddPage() {
  const router = useRouter();
  const { tenant } = router.query;
  const { t } = useTranslation();

  const initialState: NewPageSubmission = {
    newPageNumber: 0,
    image: undefined,
    releaseDate: new Date(),
    title: "",
    commentary: "",
    imageSource: "upload"
  };

  const {
    uploadForm,
    updateUploadField,
    validateForm,
    resetUploadForm,
    uploadFormError,
    setUploadFormError,
    uploadFormSuccess,
    setUploadFormSuccess,
    uploadFormLoading,
    setUploadFormLoading,
  } = useUploadForm(initialState)

  useEffect(() => {
    if (tenant) {
      axios
        .get(`/api/comic/${tenant}/page/next`)
        .then((response) => {
          const { newPageNumber } = response.data;
          updateUploadField("newPageNumber", newPageNumber);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [tenant]);

  const handleCommentaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateUploadField("authorComment", e.target.value)
  };

  const handleImageChange = (file: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];
      updateField("image", file);
    }
  };

  const handleDateChange = (date: Date) => {
    updateUploadField("releaseOn", date);
  };

  const uploadAnother = () => {
    resetForm();
    setUploadFormSuccess(false);
    updateUploadField("newPageNumber", newPageNumber + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadFormError("");
    setUploadFormSuccess(false);
    axios
      .post(`/api/comic/${tenant}/page/new`, uploadForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setSuccess(true);
      })
      .catch((error) => {
        setError(error.response?.data);
        setSuccess(false);
      });
  };

  return (
    <CaveartLayout requireLogin={true}>
      <h1>{t("comicPages.add")}</h1>
      <ComicProfileProvider>
        {uploadFormSuccess ? (
          <div>
            <Link
              type="button"
              href={`/read/${tenant}/${upload.newPageNumber}`}
            >
              {t('comicPages.view')}
            </Link>
            <Button type="button" id="reset-form" onClick={uploadAnother}>
              {t('comicPages.addAnother')}
            </Button>
          </div>
        ) : (
          <div>
            <p>{t('comicPages.newPage.number', { nextNumber: uploadForm.nextPageNumber })}</p>
            <Form
              submitLabel={t("comicPages.add")}
              formValues={uploadForm}
              onSubmit={handleSubmit}
              submissionError={uploadFormError}
            >
              <ImageUpload
                name="newPage"
                required
                id="new"
                labelText={t('comicPages.newPage.uploadYourImage')}
                editable
                value={uploadForm.image}
                maxSize={3000 * 1024}
                onChange={handleImageChange}
              />

              <TextArea
                id="author_comment"
                name="commentary"
                labelText={t('comicPages.newPage.authorComment.label')}
                placeholderText={t('comicPages.newPage.authorComment.placeholder')}
                value={uploadForm.authorComment}
                onChange={handleCommentaryChange}
              />

              <DateTimepicker
                labelText="Release date"
                onDateChange={handleDateChange}
              />
            </Form>
          </div>
        )}
      </ComicProfileProvider>
    </CaveartLayout>
  );
}

export default AddPage;
