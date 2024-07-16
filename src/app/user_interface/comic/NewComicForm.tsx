import {
  LoadingSpinner,
  Form,
  Radio,
  Checkbox
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


const NewComicForm: React.FC = () => {
  const { t } = useTranslation();
  const { state, setField, setRating, setSubmissionError } = useComicProfile();
  const { update, submissionError } = state;

  /*
  onSubmit: (formValues: FormValues) => any;
  onCancel?: (...params: any) => any;
  onSuccess?: (...params: any) => any;
  onFailure?: (...params: any) => any;
  submissionError?: string | null;
  */

  const toggleLikes = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
  }

  const handleLikesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enabled = !update.likes
    setField('likes', enabled)
  }

  const handleCommentsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setField('comments', value);
  }

  const handleVisibilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setField('visibility', value);
  }

  const handleFormSubmit = async () => {
    const submission = {...update};
    submission.genres = Object.keys(update.genres)
    let content = [];
    Object.keys(submission.content_warnings).forEach(key => {
      content.push(submission.content_warnings[key].id)
    })
    submission.content = content;
    await axios.post(`/api/comic/new`, submission,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        const message = error.response.data.error;
        console.log(message)
        setSubmissionError(message)
      })
  }

  return (
    <Form
      submitLabel={t('comicManagement.create')}
      formValues={update}
      onSubmit={handleFormSubmit}
      submissionError={submissionError}
    >
      <ComicProfileForm />
      <div className="comic-profile_settings">
        <fieldset>
          <legend>Comments</legend>
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments ==='Allowed'}
            name="comments"
            value="Allowed"
            id="comments_on"
            labelText={t('comicSettings.comments.allowed')}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments ==='Moderated'}
            name="comments"
            value="Moderated"
            id="comments_moderated"
            labelText={t('comicSettings.comments.moderated')}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments ==='Disabled'}
            name="comments"
            value="Disabled"
            id="comments_off"
            labelText={t('comicSettings.comments.disabled')}
          />
        </fieldset>
        <fieldset>
        <legend>Likes</legend>
        <Checkbox
          onChange={handleLikesChange}
          checked={update.likes}
          name="likes"
          id="likes"
          labelText={t('comicSettings.likes.enabled')}
        />
        </fieldset>
        <fieldset>
          <legend>Visibility</legend>
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Public"}
            name="visibility"
            value="Public"
            id="visibility_public"
            labelText={t('comicSettings.visibility.public')}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Unlisted"}
            name="visibility"
            value="Unlisted"
            id="visibility_unlisted"
            labelText={t('comicSettings.visibility.unlisted')}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Invite-Only"}
            name="visibility"
            value="Invite-Only"
            id="visibility_private"
            labelText={t('comicSettings.visibility.private')}
          />
        </fieldset>
      </div>
    </Form>
  );
};

export default NewComicForm;

