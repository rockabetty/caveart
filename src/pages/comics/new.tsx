import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextArea, TextInput, Button, Radio, Checkbox, Accordion } from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import '../../app/user_interface/layout.css';

const ComicProfileForm = () => {

  console.log(Checkbox)

  const [contentWarnings, setContentWarnings] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([])
  const [submissionError, setSubmissionError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState({
    name: '',
    subdomain: '',
    name: '',
    subdomain: '',
    description: '',
    genres: {},
    style: {},
    content: {},
    comments: 'allowed',
    visibility: 'Public',
    likes: { allowed: true },
    rating: 'Appropriate for everyone'
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionError("")
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitComic = () => {
    console.log("hi welcoem to chilis")
  }

  const onToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selection = formValues[e.target.name] || {}
    if (selection[e.target.value]) {
      delete selection[e.target.value]
    } else {
      selection[e.target.value] = true
    }
    setFormValues({ ...formValues, [e.target.name]: selection })
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
    console.log(formValues)
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
        name="name"
        type="text"
        id="comic_name"
        onChange={onChange}
        value={formValues?.name}
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
              onChange={onToggle}
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
        <Radio 
          labelText="Allow users to freely comment"
          checked={formValues.comments === 'Allowed'}
          name="comments"
          id="comments_allowed"
          value="Allowed"
          onChange={onChange}
        />
        <Radio 
          labelText="Allow moderated comments"
          checked={formValues.comments === 'Moderated'}
          name="comments"
          id="comments_moderated"
          value="Moderated"
          onChange={onChange}
        />
         <Radio 
          labelText="Disable comments"
          checked={formValues.comments === 'Disabled'}
          name="comments"
          id="comments_disabled"
          value="Disabled"
          onChange={onChange}
        />
      </fieldset>

      <Button id="new_comic" type="submit" onClick={submitComic} look="primary">
        Submit
      </Button>
    </CaveartLayout>
  )
}

export default ComicProfileForm;