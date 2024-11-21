import { useTranslation } from "react-i18next";
import { Button, Form, ImageUpload, Link, TextArea } from "@components";
import DateTimepicker from "@components/Form/DateTimepicker";
import { NewPageSubmission } from "@features/comic/pages";
import { useComicPage } from "@features/comic/pages/hooks/useComicPage";

const MAX_COMIC_PAGE_FILESIZE =  3 * 1024 * 1024;

type ComicPageFormProps = {
  tenant: string;
  handleSubmit: () => void;
  nextPageNumber?: number;
}

const NewComicPageForm: React.FC = ( props: ComicPageFormProps ) => {

  const { tenant, handleSubmit, nextPageNumber } = props;

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
    pageForm,
    updatePageField,
    resetPageForm,
    pageFormError,
    setPageFormError,
    pageFormSuccess,
  } = useComicPage(initialState);

  const handleCommentaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updatePageField("authorComment", e.target.value);
  };

  const handleImageChange = (files: FileList) => {
    setPageFormError("");
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_COMIC_PAGE_FILESIZE) {
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

  return (
      <ComicProfileProvider>
              <Form
                submitLabel={t("comicPages.add")}
                formValues={pageForm}
                onSubmit={handleSubmit}
                submissionError={pageFormError}
                successMessage={pageFormSuccess}
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
                    { nextPageNumber ? 
                      (<p>
                        {t("comicPages.newPage.number", {
                          nextNumber: nextPageNumber,
                        })}
                      </p>)
                      : null
                    }
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
      </ComicProfileProvider>
  );
}

export default NewComicPageForm;
