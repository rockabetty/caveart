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

  /*
  onSubmit: (formValues: FormValues) => any;
  onCancel?: (...params: any) => any;
  onSuccess?: (...params: any) => any;
  onFailure?: (...params: any) => any;
  submissionError?: string | null;
  */

  return (
    <Form
      submitLabel={t('comicManagement.save')}
      formValues={update}
    >
      <ComicProfileForm comicId={comicId} />
    </Form>
  );
};

export default EditComicProfile;

