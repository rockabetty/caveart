import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CaveartLayout from "@features/CaveartLayout";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { Button, Form, ImageUpload, Link, TextArea } from "@components";
import DateTimepicker from "@components/Form/DateTimepicker";
import { NewPageSubmission } from "@features/comic/pages";
import { useUploadForm } from "@features/comic/pages/hooks/useUploadForm";
import { MAX_COMIC_PAGE_FILESIZE } from "../../constants";
import { uploadToS3 } from "@client-services/uploads";

function AddPage() {
  const router = useRouter();
  const { tenant } = router.query;
  const { t } = useTranslation();

  const initialState: NewPageSubmission = {
    newPageNumber: 0,
    image: undefined,
    releaseDate: new Date(),
    title: "",
    authorComment: "",
    imageSource: "upload",
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
  } = useUploadForm(initialState);

  useEffect(() => {
    const getNextPage = async function () {
      if (tenant) {
        try {
          const nextPageRequest = await axios.get(
            `/api/comic/${tenant}/page/next`,
          );
          const { newPageNumber } = nextPageRequest.data;
          updateUploadField("newPageNumber", newPageNumber);
        } catch (error) {
          setUploadFormError(t("comicPages.newPage.generalError"));
        }
      }
    };
    getNextPage();
  }, [tenant]);

  const handleCommentaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updateUploadField("authorComment", e.target.value);
  };

  const handleImageChange = (files: FileList) => {
    setUploadFormError("");
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 3000 * 1024) {
        setUploadFormError(
          t("comicPages.newPage.imageTooBig", { maxMegabytes: 3 }),
        );
        return;
      }

      if (!file.type.startsWith("image/")) {
        setUploadFormError(t("comicPages.newPage.wrongFormat"));
        return;
      }

      updateUploadField("image", file);
    }
  };

  const handleDateChange = (date: Date) => {
    updateUploadField("releaseOn", date);
  };

  const uploadAnother = () => {
    setUploadFormSuccess(false);
    updateUploadField("newPageNumber", uploadForm.newPageNumber + 1);
    resetUploadForm();
  };

  const handleSubmit = async () => {
    setUploadFormError("");
    setUploadFormSuccess(false);
    setUploadFormLoading(true);

    if (!uploadForm.image) {
      setUploadFormError(t("comicPages.newPage.noImage"));
      setUploadFormLoading(false);
      return;
    }

    const { name, type } = uploadForm.image;
    const data = JSON.stringify({ name, type });

    try {
      const presignedUrl = await uploadToS3(
        uploadForm.image,
        tenant,
        "comic page",
      );

      const newPage = await axios.post(`/api/comic/${tenant}/page/new`, {
        ...uploadForm,
        imageUrl: presignedUrl,
      });

      const { success } = newPage.data;
      if (success) {
        setUploadFormSuccess(true);
      }
    } catch (error) {
      setUploadFormError(t("comicPages.newPage.generalError"));
    } finally {
      setUploadFormLoading(false);
    }
  };

  return (
    <CaveartLayout requireLogin={true}>
      <ComicProfileProvider>
        <h1>{t("comicPages.add")}</h1>

        <div className="tile">
          {uploadFormSuccess ? (
            <>
              <p>{t("comicPages.newPage.uploadConfirmation")}</p>
              <Link
                type="button"
                inline
                look="primary"
                href={`/read/${tenant}/${uploadForm.newPageNumber}`}
              >
                {t("comicPages.view")}
              </Link>
              <Button
                type="button"
                inline
                id="reset-form"
                onClick={uploadAnother}
              >
                {t("comicPages.addAnother")}
              </Button>
            </>
          ) : (
            <>
              <p>
                {t("comicPages.newPage.number", {
                  nextNumber: uploadForm.newPageNumber,
                })}
              </p>
              <Form
                submitLabel={t("comicPages.add")}
                formValues={uploadForm}
                onSubmit={handleSubmit}
                submissionError={uploadFormError}
              >
                <div className="flex Row">
                  <div className="flex-section">
                    <ImageUpload
                      name="newPage"
                      required
                      id="new"
                      labelText={t("comicPages.newPage.uploadYourImage")}
                      editable
                      value={uploadForm.image}
                      maxSize={3000 * 1024}
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex-section Grow">
                    <TextArea
                      id="author_comment"
                      name="commentary"
                      labelText={t("comicPages.newPage.authorComment.label")}
                      placeholderText={t(
                        "comicPages.newPage.authorComment.placeholder",
                      )}
                      value={uploadForm.authorComment}
                      onChange={handleCommentaryChange}
                    />

                    <DateTimepicker
                      labelText="Release date"
                      onDateChange={handleDateChange}
                    />
                  </div>
                </div>
              </Form>
            </>
          )}
        </div>
      </ComicProfileProvider>
    </CaveartLayout>
  );
}

export default AddPage;
