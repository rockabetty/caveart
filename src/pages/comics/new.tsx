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
import ComicProfileEditor from '../../app/user_interface/comic/ComicProfileEditor';
import ContentWarningSelector from '../../app/user_interface/comic/ContentWarningSelector';
import '../../app/user_interface/layout.css';
import { useTranslation } from 'react-i18next';
import { useContentWarnings, RatingName, ContentWarningUserSelection } from '../../app/user_interface/comic/hooks/useContentWarnings';

type GenreSelection = {
  [genreId: string]: number;
}

type FormValues = {
  title: string;
  subdomain: string;
  description: string;
  genres: GenreSelection;
  content?: ContentWarningUserSelection;
  comments: string;
  visibility: string;
  likes: boolean;
  rating?: RatingName;
  thumbnail: FileList | undefined
};


const ComicProfileForm = () => {

  const { t } = useTranslation();

  const { contentWarningsForDisplay, comicRating, contentWarningUserSelection, onContentChange } = useContentWarnings();
  const [genres, setGenres] = useState<any[]>([]);
  const [submissionError, setSubmissionError] = useState<string>("")
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    subdomain: '',
    description: '',
    genres: {},
    comments: 'Allowed',
    visibility: 'Public',
    likes: true,
    thumbnail: undefined
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)  => {
    setSubmissionError("")
    console.log(formValues)
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
    formData.append('rating', comicRating);


    if (formValues.thumbnail) {
      for (let i = 0; i < formValues.thumbnail.length; i++) {
        formData.append('files', formValues.thumbnail[i], formValues.thumbnail[i].name);
      }
    }

    await axios.post('/api/comic/new', formData)
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
       <ComicProfileEditor
         comicId="new"
         profile={formValues}
         onTextChange={onChange}
         genres={genres}
         onUpdateGenre={onToggleGenre}
       />

        <h2>Content Warnings</h2>
        <p>
          Please put content warnings on your comic so that we can show our users appropriate content.
        </p>
        <p>{comicRating}</p>
        
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