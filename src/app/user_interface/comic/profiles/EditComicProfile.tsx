import { LoadingSpinner, Form, Link } from "@components";
import "./ComicProfiles.css";
import { useComicProfile } from "./hooks/useComicProfile";
import ComicProfileForm from "./ComicProfileForm";
import { useTranslation } from "react-i18next";
import axios from "axios";
import React from "react";

type EditComicProfileProps = {
  tenant: string;
};

const EditComicProfile: React.FC<EditComicProfileProps> = (props) => {
  const { t } = useTranslation();
  const { tenant } = props;
  const { state, setSubmissionError, confirmEdit } = useComicProfile(tenant);
  const { update, permissions, profile, submissionError, successMessage, redirect } =
    state;

  if (permissions === undefined) {
    return <LoadingSpinner />;
  }

  if (permissions?.edit === false) {
    return <div>{t("comicProfile.errors.403")}</div>;
  }

  if (!!redirect) {
    return (
      <div>
        <p>{t('comicProfile.errors.redirect.prompt')}</p>
        <Link type="button" href={`/comic/${redirect}/edit`}>{t('comicProfile.errors.redirect.linkLabel')}</Link>
      </div>
      )
  }

  const handleFormSubmit = async () => {
    let updates: Promise<any>[] = [];

    if (!update.title) {
      return setSubmissionError("comicManagement.errors.titleMissing");
    }
    if (profile.title !== update.title) {
      updates.push(
        axios.post(`/api/comic/${tenant}/title`, { update: update.title }),
      );
    }

    if (typeof update.thumbnail !== 'string') {
      updates.push(
        axios.post(`/api/comic/${tenant}/thumbnail`, { arbitrayfield: "lol", thumbnail: update.thumbnail},  {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      );
    }

    if (!update.subdomain) {
      return setSubmissionError("comicManagement.errors.subdomainMissing");
    }
    if (profile.subdomain !== update.subdomain) {
      updates.push(
        axios.post(`/api/comic/${tenant}/subdomain`, {
          update: update.subdomain,
        }),
      );
    }

    if (profile.description !== update.description) {
      updates.push(
        axios.post(`/api/comic/${tenant}/description`, {
          update: update.description,
        }),
      );
    }

    let genres = Object.keys(profile.genres).sort().join(",");
    let newGenres = Object.keys(update.genres).sort().join(",");
    if (genres !== newGenres) {
      updates.push(
        axios.post(`/api/comic/${tenant}/genres`, {
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
        axios.post(`/api/comic/${tenant}/contentwarnings`, {
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
      <ComicProfileForm tenant={tenant} />
    </Form>
  );
};

export default EditComicProfile;
