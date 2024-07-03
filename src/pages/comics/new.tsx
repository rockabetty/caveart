import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ImageUpload,
  TextArea,
  TextInput,
  Button, Radio,
  Checkbox,
  Accordion,
  Form
} from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import GenreSelector from '../../app/user_interface/comic/GenreSelector';
import '../../app/user_interface/layout.css';
import { useTranslation } from 'react-i18next';

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
  rating: number;
  thumbnail: FileList | undefined
};

const ratingResults = {
  "someViolence": "Ages 10+",
  "someSuggestiveContent": "Ages 10+",
  "frequentViolence": "Teen (13+)",
  "someRealisticInjuries": "Teen (13+)",
  "frequentSuggestiveContent": "Teen (13+)",
  "someBlood": "Teen (13+)",
  "someThreats": "Teen (13+)",
  "someSwearing": "Teen (13+)",
  "someSlurs": "Teen (13+)",
  "someSexualLanguage": "Teen (13+)",
  "someReferencesToSubstances": "Teen (13+)",
  "someAlcoholUse": "Teen (13+)",
  "someCommonDrugUse": "Teen (13+)",
  "frequentRealisticInjuries": "Mature (17+)",
  "frequentBlood": "Mature (17+)",
  "someGore": "Mature (17+)",
  "somePartialNudity": "Teen (13+)",
  "frequentPartialNudity": "Mature (17+)",
  "someFullNudity": "Mature (17+)",
  "someSexScenes": "Mature (17+)",
  "frequentThreats": "Mature (17+)",
  "frequentSwearing": "Mature (17+)",
  "frequentSlurs": "Mature (17+)",
  "frequentSexualLanguage": "Mature (17+)",
  "frequentReferencesToSubstances": "Mature (17+)",
  "frequentAlcoholUse": "Mature (17+)",
  "someHardDrugUse": "Mature (17+)",
  "frequentGore": "Adults Only (18+)",
  "frequentFullNudity": "Adults Only (18+)",
  "frequentSexScenes": "Adults Only (18+)",
  "someSexualViolence": "Adults Only (18+)",
  "frequentSexualViolence": "Adults Only (18+)",
  "frequentHardDrugUse": "Adults Only (18+)"
};


const ComicProfileForm = () => {

  const { t } = useTranslation();

  const [contentWarnings, setContentWarnings] = useState<ContentWarning[]>([]);
  const [flatContentWarnings, setFlatContentWarnings] = useState<{[key:number]: string}>();
  const [genres, setGenres] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{[key:string] : number}>({});
  const [ratingString, setRatingString] = useState<string>("All Ages");
  const [contentWarningList, setContentWarningList] = useState<Set>(new Set());
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
    rating: -1,
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
    let content = {...formValues.content};
    let contentWarningListUpdate = new Set(contentWarningList);
    let value = undefined;
    let contentWarningName="";
    const contentWarningCategory = e.target.name;
    if(e.target.value === "none") {
      delete content[contentWarningCategory];
      const contentLabel = contentWarningCategory.charAt(0).toUpperCase() + contentWarningCategory.slice(1);
      contentWarningListUpdate.delete(`some${contentLabel}`);
      contentWarningListUpdate.delete(`frequent${contentLabel}`);
    }
    else {
      value = e.target.value;
      contentWarningName = flatContentWarnings[value];
      contentWarningListUpdate.add(contentWarningName);
      content = {...content, [contentWarningCategory]: value}
    }
    setContentWarningList(contentWarningListUpdate)
    const audienceRatings = new Set();
    for(let key of contentWarningListUpdate) {
      const rating = ratingResults[key];
      audienceRatings.add(rating)
    }
    let ratingUpdate = 'All Ages';
    if (audienceRatings.has('Adults Only (18+)')) {
      ratingUpdate = "Adults Only (18+)";
    } else if (audienceRatings.has('Mature (17+)')) {
      ratingUpdate = "Mature (17+)";
    } else if (audienceRatings.has('Teen (13+)')) {
      ratingUpdate = "Teen (13+)";
    } else if (audienceRatings.has('Ages 10+')) {
      ratingUpdate = "Ages 10+";
    }
    setRatingString(ratingUpdate);
    setFormValues({ ...formValues, content, rating: ratings[ratingUpdate] });
    
  }, [formValues])

  useEffect(() => {
    axios
      .get('/api/content')
      .then((response) => {
        setContentWarnings(response.data)
        // each individual rating is 2 deep in 4 different parts 
        let flattenedRatings = {};
      });

    axios
      .get('/api/content?format=flat')
      .then((response) => {
        setFlatContentWarnings(response.data)
      })

    axios
      .get('/api/ratings')
      .then((response) => {
        const allAges = response.data['All Ages'];
        setRatings(response.data)
        setFormValues({...formValues, rating: allAges});
      });

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
    >
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
        <p>{ratingString}</p>
        <GenreSelector
          options={genres}
          selection={formValues.genres}
          onChange={onToggleGenre}
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
            value={true}
            onChange={toggleLikes}
          />
        </fieldset>
        
      </Form>
    </CaveartLayout>
  )
}

export default ComicProfileForm;