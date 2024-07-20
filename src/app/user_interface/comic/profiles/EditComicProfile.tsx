import { LoadingSpinner, Form } from "@components";
import "./ComicProfiles.css";
import { useComicProfile } from "./hooks/useComicProfile";
import ComicProfileForm from "./ComicProfileForm";
import { useTranslation } from "react-i18next";
import axios from "axios";
import React from "react";

type EditComicProfileProps = {
  comicId: number;
};

const EditComicProfile: React.FC<EditComicProfileProps> = (props) => {
  const { t } = useTranslation();
  const { comicId } = props;
  const { state, setSubmissionError, confirmEdit } = useComicProfile(comicId);
  const { update, permissions, profile, submissionError, successMessage } =
    state;

  if (permissions === undefined) {
    return <LoadingSpinner />;
  }

  if (permissions?.edit === false) {
    return <div>{t("comicProfile.errors.403")}</div>;
  }
  const handleFormSubmit = async () => {
    let updates: Promise<any>[] = [];

    if (!update.title) {
      return setSubmissionError("comicManagement.errors.titleMissing");
    }
    if (profile.title !== update.title) {
      updates.push(
        axios.post(`/api/comic/${comicId}/title`, { update: update.title }),
      );
    }

    if (!update.subdomain) {
      return setSubmissionError("comicManagement.errors.subdomainMissing");
    }
    if (profile.subdomain !== update.subdomain) {
      updates.push(
        axios.post(`/api/comic/${comicId}/subdomain`, {
          update: update.subdomain,
        }),
      );
    }

    if (profile.description !== update.description) {
      updates.push(
        axios.post(`/api/comic/${comicId}/description`, {
          update: update.description,
        }),
      );
    }

    let genres = Object.keys(profile.genres).sort().join(",");
    let newGenres = Object.keys(update.genres).sort().join(",");
    if (genres !== newGenres) {
      updates.push(
        axios.post(`/api/comic/${comicId}/genres`, {
          old: profile.genres,
          update: update.genres,
        }),
      );
    }

    let content: number[] = [];
    let newContent: number[] = [];

    Object.values(profile.content_warnings).forEach((value) => {
      content.push(value.id);
    });
    Object.values(update.content_warnings).forEach((value) => {
      newContent.push(value.id);
    });

    if (content.sort().join(",") !== newContent.sort().join(",")) {
      updates.push(
        axios.post(`/api/comic/${comicId}/contentwarnings`, {
          old: profile.content_warnings,
          update: update.content_warnings,
          rating: update.rating,
        }),
      );
    }

    await Promise.all(updates)
      .then(() => {
        confirmEdit();
      })
      .catch((error) => {
        console.log(error);
        setSubmissionError(error.response.data.message);
      });
  };

  return (
    <Form
      submitLabel={t("comicProfile.save")}
      formValues={update}
      onSubmit={handleFormSubmit}
      submissionError={submissionError}
      successMessage={t(successMessage)}
    >
      <ComicProfileForm comicId={comicId} />
    </Form>
  );
};

export default EditComicProfile;
