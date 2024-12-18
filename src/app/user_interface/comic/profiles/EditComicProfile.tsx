import { LoadingSpinner, Form, Link, Button } from "@components";
import "./ComicProfiles.css";
import { useComicProfile } from "./hooks/useComicProfile";
import ComicProfileForm from "./ComicProfileForm";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {useState, useEffect} from "react";
import { ComicData, ComicUpdate } from "./types";

type EditComicProfileProps = {
  tenant: string;
};

const EditComicProfile: React.FC<EditComicProfileProps> = (props) => {
  const { t } = useTranslation();
  const {tenant} = props;
  const {state, setSubmissionError, confirmEdit, uploadThumbnail} = useComicProfile(tenant);
  const {update, permissions, profile, submissionError, successMessage, redirect} =
    state;

  const [tenantResolved, setTenantResolved] = useState(!!tenant);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
  const timeout = !tenant ? setTimeout(() => setShowError(true), 3000) : null;

  if (tenant) {
    setTenantResolved(true);
  }

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}, [tenant]);

  if (!tenantResolved && !showError) {
    return <LoadingSpinner />;
  }

  if (permissions === undefined) {
    return <LoadingSpinner />;
  }

  if (showError && !tenant) {
    return <div>{t("comicProfile.errors.missingTenant")}</div>;
  }


  if (permissions?.edit === false) {
    return <div>{t("comicProfile.errors.403")}</div>;
  }

  if (!!redirect) {
    return (
      <div>
        <p>{t("comicProfile.errors.redirect.prompt")}</p>
        <Link type="button" href={`/comic/${redirect}/edit`}>
          {t("comicProfile.errors.redirect.linkLabel")}
        </Link>
      </div>
      )
  }

  const handleFormSubmit = async () => {
    let data: ComicUpdate = {
      id: profile.id
    };

    if (profile.title !== update.title) {
      data.title = update.title;
    }

    if (typeof update.thumbnail !== 'string') {
      data.thumbnail = update.thumbnail;
    }

    if (profile.subdomain !== update.subdomain) {
      data.subdomain = update.subdomain;
    }

    if (profile.description !== update.description) {
      data.description = update.description;
    }

    let genres = Object.keys(profile.genres).sort().join(",");
    let newGenres = Object.keys(update.genres).sort().join(",");
    if (genres !== newGenres) {
      data.genres = update.genres;
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
      data.content_warnings = update.content_warnings;
      data.rating = update.rating;
    }

    try {
      await axios.put(`/api/comic/${tenant}`, data);
      confirmEdit();
    } catch (error: any) {
        console.log(error);
        setSubmissionError(error.response.data.message);
    }
  }

  return (
    <>
    <Form
      submitLabel={t("comicProfile.save")}
      formValues={update}
      onSubmit={handleFormSubmit}
      submissionError={submissionError}
      successMessage={t(successMessage)}
    >
      <ComicProfileForm tenant={tenant || ""} />
    </Form>
    </>
  );
};

export default EditComicProfile;