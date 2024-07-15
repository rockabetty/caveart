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
  const { state, setField, setRating } = useComicProfile();
  const { update } = state;

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

  /*
    const handleGenreSelection = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let newSelection: GenreUserSelection = update.genres;
    const value: string = e.target.value;
    const idNumber = Number(value);
    if (!newSelection[idNumber]) {
      newSelection[idNumber] = genres[idNumber];
    } else {
      delete newSelection[idNumber];
    }
    setField("genres", newSelection);
  };
  */

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
    if (value === 'moderated') { 
      setField('comments', true);
      setField('moderate_comments', true);
    } else if (value === 'on') {
      setField('comments', true);
      setField('moderate_comments', false);
    } else {
      setField('comments', false);
      setField('moderate_comments', false);
    }
  }

  const handleVisibilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    if (value === 'unlisted') {
      setField('is_unlisted', true);
      setField('is_private', false);
    } else if (value === 'private') {
      setField('is_private', true);
      setField('is_unlisted', false);
    } else {
      setField('is_private', false);
      setField('is_unlisted', false);
    }
  }

  const handleFormSubmit = () => {

  }

  return (
    <Form
      submitLabel={t('comicManagement.create')}
      formValues={update}
      onSubmit={handleFormSubmit}
    >
      <ComicProfileForm />
      <div className="comic-profile_settings">
        <fieldset>
          <legend>Comments</legend>
          <Radio
            onChange={handleCommentsChange}
            checked={!!update.comments && !update.moderate_comments}
            name="comments"
            value="on"
            id="comments_on"
            labelText={t('comicSettings.comments.allowed')}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={!!update.moderate_comments}
            name="comments"
            value="moderated"
            id="comments_moderated"
            labelText={t('comicSettings.comments.moderated')}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={!update.comments && !update.moderate_comments}
            name="comments"
            value="off"
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
            checked={!update.is_private && !update.is_unlisted}
            name="visibility"
            value="public"
            id="visibility_public"
            labelText={t('comicSettings.visibility.public')}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.is_unlisted}
            name="visibility"
            value="unlisted"
            id="visibility_unlisted"
            labelText={t('comicSettings.visibility.unlisted')}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.is_private}
            name="visibility"
            value="private"
            id="visibility_private"
            labelText={t('comicSettings.visibility.private')}
          />
        </fieldset>
      </div>
    </Form>
  );
};

export default NewComicForm;

