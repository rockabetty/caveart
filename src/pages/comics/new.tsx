import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ImageUpload,
  TextArea,
  TextInput,
  Radio,
  Checkbox,
  Form
} from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import GenreSelection from '../../app/user_interface/comic/GenreSelection';
import ContentWarningSelector from '../../app/user_interface/comic/ContentWarningSelector';
import '../../app/user_interface/layout.css';
import { useTranslation } from 'react-i18next';
import { useContentWarnings, ContentWarningUserSelection } from '../../app/user_interface/comic/hooks/useContentWarnings';

type GenreSelection = {
  [genreId: string]: number;
}

type FormValues = {
  title: string;
  subdomain: string;
  description: string;
  genres: GenreSelection;
  content: ContentWarningUserSelection;
  comments: string;
  visibility: string;
  likes: boolean;
  rating: number;
  thumbnail: FileList | undefined
};


const ComicProfileForm = () => {

  const { t } = useTranslation();

  const { contentWarningsForDisplay, ratingString, ratingId, contentWarningUserSelection, onContentChange } = useContentWarnings();
  const [genres, setGenres] = useState<any[]>([]);
  const [submissionError, setSubmissionError] = useState<string>("")
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    subdomain: '',
    description: '',
    genres: {},
    content: {},
    comments: 'Allowed',
    visibility: 'Public',
    likes: true,
    rating: 1,
    thumbnail: undefined
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)  => {
    setSubmissionError("")
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const onFileChange = (files: FileList | undefined) => {
    setFormValues({
      ...formValues,
      thumbnail: files
    }) 
  };

  const submitComic = async () => {
    const formData = new FormData();
    const fileList = formValues.thumbnail;

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i], fileList[i].name);
      }
    }

    // TODO: Fix this shoddy code because Typescript hates it and I hate it
    for (const key in formValues) {
      //@ts-ignore 
      if (key !== 'thumbnail' && formValues[key] !== null) {
      //@ts-ignore 
      const value = formValues[key];
      if (typeof value === 'object') {
        // Special handling for objects (e.g., JSON.stringify)
        formData.append(key, JSON.stringify(value));
      } else {
          formData.append(key, value.toString());
        }
      }
    }
    formData.append('content', JSON.stringify(contentWarningUserSelection));
    formData.append('rating', ratingId.toString());

    if (formValues.thumbnail) {
      for (let i = 0; i < formValues.thumbnail.length; i++) {
        formData.append('files', formValues.thumbnail[i], formValues.thumbnail[i].name);
      }
    }

    await axios.post('/api/comics/new', formData)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      const {error} = err.response.data;
      setSubmissionError(error)
    })
  }

  const onToggleGenre = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);
    const currentGenres: GenreSelection = { ...formValues.genres };
    if (currentGenres[currentValue]) {
      delete currentGenres[currentValue];
    } else {
      currentGenres[currentValue] = currentValue;
    }
    const updatedFormValues = {
      ...formValues,
      genres: currentGenres
    };
    setFormValues(updatedFormValues);
  }, [formValues]);

  const toggleLikes = useCallback(() => {
    const allowLikes = formValues.likes;
    setFormValues({
      ...formValues,
      likes: !allowLikes
    })
  }, [formValues]);

  useEffect(() => {
      axios
        .get('/api/genres')
        .then((response) => {
          setGenres(response.data)
      })

  }, [])

  return(
    <CaveartLayout>
    <Form
      id="new_comic"
      submitLabel={t('comicManagement.create')}
      onSubmit={submitComic}
      submissionError={submissionError}
      formValues={{formValues}}
    >
       <TextInput
          labelText="Name of comic"
          name="title"
          type="text"
          id="comic_name"
          pattern="^[a-zA-Z0-9 !\-?]+$"
          onChange={onChange}
          value={formValues?.title}
          placeholderText="Unga Bunga Grunga"
          required={true}
        />

        <TextInput
          labelText="Subdomain"
          name="subdomain"
          helperText="A-Z, numbers, hyphens and undescores only.  Your comic will be hosted at http://yourChoice.caveartcomics.com"
          id="comic_subdomain"
          onChange={onChange}
          pattern="[A-Za-z0-9\-_]{1,}"
          value={formValues?.subdomain}
          placeholderText="unga-bunga-grunga"
          required={true}
        />

        <TextArea
          labelText="Description"
          name="description"
          id="comic_description"
          placeholderText="Tell us about your comic!"
          onChange={onChange}
          value={formValues?.description}
          required={false}
        />

        <ImageUpload
          labelText="Cover Image"
          helperText="Cover images can be up to 1MB."
          editable={true}
          maxSize={1000}
          src="/img/brand/kraugak.png"
          onChange={onFileChange}
        />

        <h2>Content Warnings</h2>
        <p>
          Please put content warnings on your comic so that we can show our users appropriate content.
        </p>
        <ContentWarningSelector
          selection={contentWarningUserSelection}
          options={contentWarningsForDisplay}
          onChange={onContentChange}
        />
        <p>{ratingString}</p>
        <h2>Genres</h2>
        <GenreSelection
          id="new_comic"
          allGenreChoices={genres}
          comicProfileGenres={formValues.genres}
          onChange={onToggleGenre}
          parentIsEditing
        />

        <h2>Settings</h2>
        <fieldset>
          <legend>Visibility</legend>
          {['Public', 'Unlisted', 'Invite-Only'].map((option, idx) => {
            return (
              <div key={idx}>
                <Radio
                  labelText={option}
                  checked={formValues.visibility === option}
                  name="visibility"
                  id={`visibility-${option}`}
                  value={option}
                  onChange={onChange}
                />
              </div>
            )
          })}
        </fieldset>

        <fieldset>
          <legend>Comments on comic pages</legend>
           {['Allowed', 'Moderated', 'Disabled'].map((option, idx) => {
            return (
              <div key={idx}>
                <Radio
                  labelText={option}
                  checked={formValues.comments === option}
                  name="comments"
                  id={`comments-${option}`}
                  value={option}
                  onChange={onChange}
                />
              </div>
            )
          })}
        </fieldset>
        <fieldset>
          <legend>User ratings</legend>
          <Checkbox
            labelText="Allow likes"
            checked={formValues.likes}
            id={`likes`}
            value={formValues.likes ? "true" : "false"}
            onChange={toggleLikes}
          />
        </fieldset>
        
      </Form>
    </CaveartLayout>
  )
}

export default ComicProfileForm;