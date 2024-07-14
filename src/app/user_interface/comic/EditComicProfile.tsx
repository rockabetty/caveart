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
import { GenreSelection } from "../../../data/types";

type EditComicProfileProps = {
  comicId: number;
};

const EditComicProfile: React.FC<EditComicProfileProps> = (
  props: EditComicProfileProps,
) => {
  const { t } = useTranslation();
  const { comicId } = props;
  const { state, enableEditing, setField } = useComicProfile(comicId);
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
    let newSelection = update.genres;
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
    const value: string = e.target.value as string;
    if (value === "none") {
      delete newSelection[field];
    } else {
      newSelection[field] = value;
    }
    setField("content_warnings", newSelection);
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
        <h2>Basic Info</h2>
        <TextInput
          onChange={handleTextInput}
          labelText="Title"
          id={`title-edit-${comicId}`}
          pattern="^[a-zA-Z0-9 !:_\-?]+$"
          placeholderText="Unga Bunga: The Grungas of Wunga"
          name="title"
          required
          value={update?.title}
        />
        <TextInput
          onChange={handleTextInput}
          labelText="Subdomain"
          helperText="A-Z, numbers, hyphens and undescores only.  Your comic will be hosted at http://yourChoice.caveartcomics.com"
          name="subdomain"
          pattern="[A-Za-z0-9\-_]{1,}"
          placeholderText="ungabunga"
          id={`subdomain-edit-${comicId}`}
          value={update?.subdomain}
          required
        />
        <TextArea
          onChange={handleTextInput}
          labelText="Description"
          name="description"
          placeholderText="Tell us about your comic!"
          id={`description-edit-${comicId}`}
          value={update?.description}
        />
        <h2>Genres</h2>
        <GenreSelector
          selection={update?.genres}
          options={genres}
          onChange={handleGenreSelection}
        />
        <h2>Content Warnings</h2>
        <p>
          Help users filter out unwanted content (such as for personal
          preferences, NSFW controls, and so on) by selecting any content
          warning labels that apply.
        </p>
        <ContentWarningSelector
          selection={update?.content_warnings}
          options={contentWarnings}
          onChange={handleContentWarningSelection}
        />
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
