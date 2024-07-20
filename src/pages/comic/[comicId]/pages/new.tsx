import CaveartLayout from "../../../../app/user_interface/CaveartLayout";
import ComicProfileProvider from "../../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Button, Form, ImageUpload, Link, TextArea } from "@components";
import { useEffect, useState } from "react";
import DateTimepicker from "@components/Form/DateTimepicker";

type NewPageSubmission = {
  image?: FileList | File;
  newPageNumber: number;
  releaseDate: Date;
  commentary?: string;
};

function AddPage() {
  const router = useRouter();
  const { comicId } = router.query;
  console.log(comicId);
  const { t } = useTranslation();
  const [upload, setUpload] = useState<NewPageSubmission>({
    newPageNumber: 0,
    image: undefined,
    releaseDate: new Date(),
  });

  useEffect(() => {
    if (comicId) {
      axios
        .get(`/api/comic/${comicId}/page/next`)
        .then((response) => {
          const { newPageNumber } = response.data;
          setUpload({ ...upload, newPageNumber });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [comicId]);

  const handleCommentaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setUpload({ ...upload, commentary: value });
    console.log(upload);
  };

  const handleImageChange = (file: FileList) => {
    setUpload({ ...upload, image: file });
  };

  const uploadAnother = () => {
    setSuccess(false);
    setUpload({
      newPageNumber: upload.newPageNumber + 1,
      image: undefined,
      releaseDate: new Date(),
    });
  };

  const handleSubmit = () => {
    setError("");
    setSuccess(false);
    axios
      .post(`/api/comic/${comicId}/page/new`, upload, {
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

  const handleDateChange = (date: Date) => {
    setUpload({ ...upload, releaseDate: date });
  };

  const [error, setError] = useState<string>("");
  const [succcess, setSuccess] = useState<boolean>(false);

  return (
    <CaveartLayout requireLogin={true}>
      <h1>{t("comicManagement.addPage.title")}</h1>
      <ComicProfileProvider>
        {succcess ? (
          <div>
            <Link
              type="button"
              href={`/read/${comicId}/${upload.newPageNumber}`}
            >
              Go to page
            </Link>
            <Button type="button" id="reset-form" onClick={uploadAnother}>
              Upload another
            </Button>
          </div>
        ) : (
          <div>
            <p>Next page number: {upload.newPageNumber}</p>
            <Form
              submitLabel={t("comicManagement.addPage")}
              formValues={upload}
              onSubmit={handleSubmit}
              submissionError={error}
            >
              <ImageUpload
                name="newPage"
                required
                id="new"
                labelText="Upload your comic image"
                editable
                value={upload.image}
                maxSize={3000 * 1024}
                onChange={handleImageChange}
              />

              <TextArea
                id="author_comment"
                name="commentary"
                labelText="Author comment"
                placeholderText="Tell us about your favorite part of this page, your process, or whatever comes to mind."
                value={upload.commentary}
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
