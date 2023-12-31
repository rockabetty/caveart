import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ImageUpload,
  TextArea,
  TextInput,
  Button, Radio,
  Checkbox,
  Accordion
} from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import '../../app/user_interface/layout.css';

type GenreSelection = {
  [genreId: string | number]: boolean;
}

type ContentWarningSelection = {
  [ContentWarningName: string]: string | undefined;
}

type ContentWarning = {
  id: string;
  name: string;
  children: ContentWarning[];
};

type FormValues = {
  title: string;
  subdomain: string;
  description: string;
  genres: GenreSelection;
  content: ContentWarningSelection;
  comments: string;
  visibility: string;
  likes: boolean;
  rating: string;
  thumbnail: FileList | undefined
};

const ComicProfileForm = () => {

  const [contentWarnings, setContentWarnings] = useState<ContentWarning[]>([]);
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
    rating: 'Appropriate for everyone',
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

    // Handle the 'thumbnail' field if needed
    if (formValues.thumbnail) {
      for (let i = 0; i < formValues.thumbnail.length; i++) {
        formData.append('files', formValues.thumbnail[i], formValues.thumbnail[i].name);
      }
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
      currentGenres[currentValue] = true;
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

  const onContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const content = {...formValues.content};
    let value = undefined;
    const contentMarker = e.target.name;
    if(e.target.value === "none") {
      delete content[contentMarker];
    }
    else value = e.target.value;
    const newContent = {...content, [contentMarker]: value}
    setFormValues({ ...formValues, content: newContent })
  }, [formValues])

  useEffect(() => {
    axios
      .get('/api/content')
      .then((response) => {
        setContentWarnings(response.data)
      })

    axios
      .get('/api/genres')
      .then((response) => {
        setGenres(response.data)
      })
  }, [])

  return(
    <CaveartLayout>
     <TextInput
        labelText="Name of comic"
        name="title"
        type="text"
        id="comic_name"
        pattern={/^[a-zA-Z0-9 !\-?]+$/}
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
        pattern={/[A-Za-z0-9\-_]{1,}/}
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
      <div className="ReactiveGrid">
        {contentWarnings.map((warning: ContentWarning, idx: number) => {
          return (
              <Accordion key={idx}>
                {warning.name}
                {warning.children.map((child: ContentWarning, idx: number) => {
                  const name = child.name;
                  return (
                    <fieldset className="form-field" key={`content-warning-${idx}`}>  
                      <legend><strong>{child.name}:</strong></legend> 
                      <Radio
                        id={`no-cw-${name}`}
                        onChange={onContentChange}
                        labelText="No"
                        checked={formValues.content[name] === undefined}
                        name={name}
                        value="none"
                      />
                      {child.children.map((option: ContentWarning, idx: number) => {
                        return (
                          <Radio
                            id={`cw-${name}-${option.id}`}
                            key={`cw-key-${idx}`}
                            onChange={onContentChange}
                            labelText={["Some", "Frequent"][idx]}
                            name={name}
                            checked={formValues.content[name] == option.id }
                            value={option.id}
                          />)  
                      })}
                    </fieldset>
                  )
                })}
              </Accordion>
          )}
        )}
      </div>

      <h2>Genres</h2>
      <div className="ReactiveGrid">
        {genres.map((genre) => {
          return (
            <div key={`genre-${genre.id}`}>
              <Checkbox
                labelText={genre.name}
                id={`genre-${genre.id}`}
                checked={!!formValues.genres[genre.id as string | number]}
                onChange={onToggleGenre}
                name="genres"
                value={genre.id.toString()}
              />
            </div>
          );
        })}
      </div>

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
          value={true}
          onChange={toggleLikes}
        />
      </fieldset>

      <p className="HasError">{submissionError}</p>
      <Button id="new_comic" type="submit" onClick={submitComic} look="primary">
        Submit
      </Button>
    </CaveartLayout>
  )
}

export default ComicProfileForm;