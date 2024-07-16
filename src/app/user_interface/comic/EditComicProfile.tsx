import {
  LoadingSpinner,
  Form
} from "../../../../component_library";
import "./ComicProfiles.css";
import { useEffect, useState } from "react";
import { useComicProfile } from "./hooks/useComicProfile";
import ComicProfileForm from './ComicProfileForm';
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  ComicData,
  ContentWarningUserSelection,
  GenreUserSelection,
} from "./types";

type EditComicProfileProps = {
  comicId: number;
};

const EditComicProfile: React.FC<EditComicProfileProps> = (
  props: EditComicProfileProps,
) => {
  const { t } = useTranslation();
  const { comicId } = props;
  const { state, enableEditing, setField, setRating } = useComicProfile(comicId);
  const { update, permissions } = state;

  if (permissions === undefined) {
    return <LoadingSpinner />;
  }

  if (permissions?.edit === false) {
    return <div>{t("statusCodes.403")}</div>;
  }
  const handleFormSubmit = async () => {
    let updates : Promise[] = [];
    console.log("hndling")

    if(!update.title) {
      return setSubmissionError('comicManagement.errors.titleMissing')
    }
    if (profile.title !== update.title) {
      updates.push(axios.post(`/api/comic/${comicId}/title`, { update: update.title }))
    }

    if (!update.subdomain) {
      return setSubmissionError('comicManagement.errors.subdomainMissing')
    }
    if (profile.subdomain !== update.subdomain) {
      updates.push(axios.post(`/api/comic/${comicId}/subdomain`, {update: update.subdomain}))
    }

    if (profile.description !== update.subdomain) {
      updates.push(axios.post(`/api/comic/${comicId}/description`, {update: update.description}))
    }

    let newGenres = [];
    let genres = [];
    console.log(updates)

    Object.keys(profile.genres).forEach(key => {
      genres.push(key.id)
    })
    Object.keys(update.genres).forEach(key => {
      newGenres.push(key.id)
    })
    if ( genres.sort().join(",") !== newGenres.sort().join(",") ) {
      updates.push(axios.post(`/api/comic/${comicId}/genres`, {update: newGenres}))
    }

    let content = [];
    let newContent = [];
    Object.values(profile.content_warnings).forEach((object) => {
      content.push(object.id)
    })
    Object.values(update.content_warnings).forEach((object) => {
      content.push(object.id)
    })
    if (content.sort().join(",") !== newContent.sort().join(",")) {
      updates.push(axios.post(`/api/comic/${comicId}/contentwarnings`, {warnings: newContent, rating: update.rating }))
    }

    console.log(updates)

    await Promise.all(updates)
      .then((response) => {
        console.log("yay")
      })
      .catch((error) => {
        console.log("nooo")
      })
    
  }

  return (
    <Form
      submitLabel={t('comicManagement.save')}
      formValues={update}
      onSubmit={handleFormSubmit}
    >
      <ComicProfileForm comicId={comicId} />
    </Form>
  );
};

export default EditComicProfile;

