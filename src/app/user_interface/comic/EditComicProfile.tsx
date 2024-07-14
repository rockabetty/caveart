import {
  Form,
  LoadingSpinner,
  TextInput,
  TextArea,
} from "../../../../component_library";
import "./ComicProfiles.css";
import { useEffect, useState } from "react";
import { useComicProfile } from "./hooks/useComicProfile";
import GenreSelector from "./GenreSelector";
import ContentWarningSelector from "./ContentWarningSelector";
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
  const [genres, setGenres] = useState([]);
  const [contentWarnings, setContentWarnings] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      try {
        const genres = await axios.get(`/api/genres`);
        const content = await axios.get(`/api/content`);
        setGenres(genres.data);
        setContentWarnings(content.data);
      } catch (error: any) {
        console.error(error);
      }
    };
    getOptions();
  }, []);

  useEffect(() => {
    enableEditing();
  }, [comicId]);

  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = e.target;
    setField(name as keyof ComicData, value);
  };

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


  const handleContentWarningSelection = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let field: string = e.target.name;
    let newSelection: ContentWarningUserSelection = update.content_warnings;
    const value = e.target.value;
    if (value === "none") {
      delete newSelection[field];
    } else {
      const entry = {
        id: Number(value),
        name: e.target.id
      }
      newSelection[field] = entry;
    }
    setField("content_warnings", newSelection);
    setRating(newSelection);
  };

  if (permissions === undefined) {
    return <LoadingSpinner />;
  }

  if (permissions?.edit === false) {
    return <div>{t("statusCodes.403")}</div>;
  }

  return (
    <div className="comic-profile">
      <Form id={`editform-${comicId}`} formValues={update}>
        <h2>{t('comicProfile.basicInfo')}</h2>
        <TextInput
          onChange={handleTextInput}
          labelText={t('comicProfile.title')}
          id={`title-edit-${comicId}`}
          pattern="^[a-zA-Z0-9 !:_\-?]+$"
          placeholderText="Unga Bunga: The Grungas of Wunga"
          name="title"
          required
          value={update?.title}
        />
        <TextInput
          onChange={handleTextInput}
          labelText={t('comicProfile.subdomain')}
          helperText={t('comicProfile.helperTexts.subdomain', {domain: update?.subdomain || 'XYZ' })}
          name="subdomain"
          pattern="[A-Za-z0-9\-_]{1,}"
          placeholderText="ungabunga"
          id={`subdomain-edit-${comicId}`}
          value={update?.subdomain}
          required
        />
        <TextArea
          onChange={handleTextInput}
          labelText={t('comicProfile.description')}
          name="description"
          placeholderText={t('comicProfile.helperTexts.description')}
          id={`description-edit-${comicId}`}
          value={update?.description}
        />
        <h2>{t('genres.title')}</h2>
        <GenreSelector
          selection={update?.genres}
          options={genres}
          onChange={handleGenreSelection}
        />
        <h2>{t('contentWarnings.title')}</h2>
        <p>
          {t('contentWarnings.description')}
        </p>
        <ContentWarningSelector
          selection={update?.content_warnings}
          options={contentWarnings}
          onChange={handleContentWarningSelection}
        />
         {update.rating}
      </Form>
    </div>
  );
};
/*
  <Form
              id={`editform-${comicId}`}
              onSubmit={}
              submissionError=""
              submitLabel="Save"
              formValues={}
              cancelLabel="Cancel"
              onCancel={}
        >
*/

export default EditComicProfile;

