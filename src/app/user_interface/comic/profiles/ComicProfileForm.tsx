import {
  TextInput,
  TextArea,
  ImageUpload
} from "@components";
import "./ComicProfiles.css";
import { useEffect, useState } from "react";
import { useComicProfile } from "./hooks/useComicProfile";
import GenreSelector from "./GenreSelector";
import ContentWarningSelector from "./ContentWarningSelector";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  ComicData,
  GenreUserSelection,
} from "./types";

type ComicProfileFormProps = {
  tenant?: string;
};

const ComicProfileForm: React.FC<ComicProfileFormProps> = (
  props
) => {
  const { t } = useTranslation();
  const { tenant } = props;
  const { state, enableEditing, setField, setRating } = useComicProfile(tenant);
  const { update } = state;
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
  }, [tenant]);

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
    const value = e.target.value;
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
    let field = e.target.name;
    let newSelection = update.content_warnings;
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

  const handleImageChange = (file: FileList) => {
    setField("thumbnail", file[0])
  }

  return (
    <>
      <div className="flex Row">
        <div className="flex-section">
        <ImageUpload
          editable
          helperText={t('comicProfile.coverImageSize', {megabytes: '3'})}
          id={`${tenant ? `${tenant}-` : ''}cover_image`}
          src={update?.thumbnail ? update.thumbnail : "/img/brand/kraugak.png"}
          alt="Preview cover image"
          maxSize={1000}
          labelText={t('comicProfile.coverImage')}
          value={update.thumbnail}
          onChange={handleImageChange}
         />
         </div>

        <div className="flex-section Grow">
          <h1>{t('comicProfile.basicInfo')}</h1>
          <TextInput
            onChange={handleTextInput}
            labelText={t('comicProfile.title')}
            id={`title-edit-${tenant}`}
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
            id={`subdomain-edit-${tenant}`}
            value={update?.subdomain}
            required
          />
          <TextArea
            onChange={handleTextInput}
            labelText={t('comicProfile.description')}
            name="description"
            placeholderText={t('comicProfile.helperTexts.description')}
            id={`description-edit-${tenant}`}
            value={update?.description}
          />
        </div>
      </div>
      
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
    </>
  );
};

export default ComicProfileForm;

