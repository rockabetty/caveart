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

  return (
    <Form
      submitLabel={t('comicManagement.create')}
      formValues={update}
    >
      <ComicProfileForm />
      <div className="comic-profile_settings">
        <fieldset>
          <legend>Comments</legend>
          <Radio
            name="comments"
            value="true"
            id="comments_on"
            labelText={t('comicSettings.comments.allowed')}
          />
          <Radio
            name="comments"
            value="true"
            id="comments_moderated"
            labelText={t('comicSettings.comments.moderated')}
          />
          <Radio
            name="comments"
            value="true"
            id="comments_on"
            labelText={t('comicSettings.comments.disabled')}
          />
        </fieldset>
        <fieldset>
        <legend>Likes</legend>
        <Checkbox
          name="likes"
          id="likes"
          labelText={t('comicSettings.likes.enabled')}
        />
        </fieldset>
        <fieldset>
          <legend>Visibility</legend>
          <Radio
            name="visibility"
            value="public"
            id="visibility_public"
            labelText={t('comicSettings.visibility.public')}
          />
          <Radio
            name="visibility"
            value="unlisted"
            id="visibility_unlisted"
            labelText={t('comicSettings.visibility.unlisted')}
          />
          <Radio
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

