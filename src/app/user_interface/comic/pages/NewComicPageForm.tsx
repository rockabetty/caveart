import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { Button, Form, ImageUpload, Link, TextArea } from "@components";
import DateTimepicker from "@components/Form/DateTimepicker";
import { NewPageSubmission } from "@features/comic/pages";
import { useComicPage } from "@features/comic/pages/hooks/useComicPage";
import { uploadToS3 } from "@client-services/uploads";

const MAX_COMIC_PAGE_FILESIZE =  3 * 1024 * 1024;

const NewComicPageForm: React.FC = ( props ) => {

  const { tenant } = props;

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
    uploadComicPage,
    pageForm,
    updatePageField,
    resetPageForm,
    pageFormError,
    setPageFormError,
    pageFormSuccess,
    setPageFormSuccess,
    pageFormLoading,
    setPageFormLoading,
  } = useComicPage(initialState);


  useEffect(() => {
    const getNextPage = async function () {
      if (tenant) {
        try {
          const nextPageRequest = await axios.get(
            `/api/comic/${tenant}/page/next`,
          );
          const { newPageNumber } = nextPageRequest.data;
          updatePageField("newPageNumber", newPageNumber);
        } catch (error) {
          setPageFormError(t("comicPages.newPage.generalError"));
        }
      }
    };
    getNextPage();
  }, [tenant]);

  const handleCommentaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updatePageField("authorComment", e.target.value);
  };

  const handleImageChange = (files: FileList) => {
    setPageFormError("");
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 3000 * 1024) {
        setPageFormError(
          t("comicPages.newPage.imageTooBig", { maxMegabytes: 3 }),
        );
        return;
      }

      if (!file.type.startsWith("image/")) {
        setPageFormError(t("comicPages.newPage.wrongFormat"));
        return;
      }

      updatePageField("image", file);
    }
  };

  const handleDateChange = (date: Date) => {
    updatePageField("releaseOn", date);
  };

  const uploadAnother = () => {
    setPageFormSuccess(false);
    updatePageField("newPageNumber", pageForm.newPageNumber + 1);
    resetPageForm();
  };

  const handleSubmit = async () => {
    setPageFormError("");
    setPageFormSuccess(false);
    setPageFormLoading(true);

    if (!pageForm.image) {
      setPageFormError(t("comicPages.newPage.noImage"));
      setPageFormLoading(false);
      return;
    }

    const { name, type } = pageForm.image;
    const data = JSON.stringify({ name, type });

    try {
      const imageUrl = await uploadComicPage(tenant);

      const newPage = await axios.post(`/api/comic/${tenant}/page/new`, {
        ...pageForm,
        imageUrl
      });

      const { success } = newPage.data;
      if (success) {
        setPageFormSuccess(true);
      }
    } catch (error) {
      console.log(error)
      setPageFormError(t("comicPages.newPage.generalError"));
    } finally {
      setPageFormLoading(false);
    }
  };

  return (
      <ComicProfileProvider>
       
          {pageFormSuccess ? (
            <>
              <p>{t("comicPages.newPage.uploadConfirmation")}</p>
              <Link
                type="button"
                inline
                look="primary"
                href={`/read/${tenant}/${pageForm.newPageNumber}`}
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
             
              <Form
                submitLabel={t("comicPages.add")}
                formValues={pageForm}
                onSubmit={handleSubmit}
                submissionError={pageFormError}
              >
                <div className="flex Row">
                  <div className="flex-section">
                    <ImageUpload
                      name="newPage"
                      required
                      id="new"
                      labelText={t("comicPages.newPage.uploadYourImage")}
                      editable
                      value={pageForm.image}
                      maxSize={3000 * 1024}
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex-section Grow">
                    <h1>{t("comicPages.add")}</h1>
                    <p>
                      {t("comicPages.newPage.number", {
                        nextNumber: pageForm.newPageNumber,
                      })}
                    </p>
                    <TextArea
                      id="author_comment"
                      name="commentary"
                      labelText={t("comicPages.newPage.authorComment.label")}
                      placeholderText={t(
                        "comicPages.newPage.authorComment.placeholder",
                      )}
                      value={pageForm.authorComment}
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

      </ComicProfileProvider>
  );
}

export default NewComicPageForm;
