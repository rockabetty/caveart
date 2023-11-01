import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextArea, TextInput, Button, Radio, Checkbox, Accordion } from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import '../../app/user_interface/layout.css';

const ComicProfileForm = () => {

  const [contentWarnings, setContentWarnings] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([])
  const [submissionError, setSubmissionError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState({
    title: '',
    subdomain: '',
    description: '',
    genres: {},
    content: {},
    comments: 'allowed',
    visibility: 'Public',
    likes: true,
    rating: 'Appropriate for everyone'
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionError("")
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitComic = async () => {
    const response = await axios.post('/api/comics/new', formValues)
    .then((response) => {
      console.log(response)
    })
  }

  const onToggleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selection = formValues[e.target.name] || {}
    if (selection[e.target.value]) {
      delete selection[e.target.value]
    } else {
      selection[e.target.value] = true
    }
    setFormValues({ ...formValues, [e.target.name]: selection })
  }

  const toggleLikes = () => {
    const allowLikes = formValues.likes;
    setFormValues({
      ...formValues,
      likes: !allowLikes
    })
  }

  const onContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = {...formValues.content};
    let value = undefined;
    const contentMarker = e.target.name;
    if(e.target.value === "none") {
      delete content[contentMarker];
    }
    else value = e.target.value;
    const newContent = {...content, [contentMarker]: value}
    setFormValues({ ...formValues, content: newContent })
  }

  useEffect(() => {
    const contentWarnings = axios
      .get('/api/content')
      .then((response) => {
        setContentWarnings(response.data)
      })

    const genres = axios
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
      />

      <h2>Content Warnings</h2>
      <p>
        Please put content warnings on your comic so that we can show our users appropriate content.
      </p>
      <div className="ReactiveGrid">
        {contentWarnings.map((warning, idx) => {
          return (
              <Accordion key={idx}>
                {warning.name}
                {warning.children.map((child, idx) => {
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
                      {child.children.map((option, idx) => {
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
      <div class="ReactiveGrid">
        {genres.map((genre, idx) => {
          return (
            <div>
            <Checkbox
              key={`genre-${idx}`}
              labelText={genre.name}
              id={`genre-${genre.name}`}
              checked={formValues.genres[genre.id]}
              onChange={onToggleTag}
              name="genres"
              value={genre.id}
            />
            </div>
          );
        })}
      </div>

      <h2>Settings</h2>
      <fieldset>
        <legend>Visibility</legend>
        {['Public', 'Private', 'Invite-Only'].map((option, idx) => {
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

      <Button id="new_comic" type="submit" onClick={submitComic} look="primary">
        Submit
      </Button>
    </CaveartLayout>
  )
}

export default ComicProfileForm;