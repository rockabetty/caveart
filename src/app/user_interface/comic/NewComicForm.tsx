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
    </Form>
  );
};

export default NewComicForm;

