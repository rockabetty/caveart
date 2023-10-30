import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextArea, TextInput, Button, Radio, Accordion } from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout';
import '../../app/user_interface/layout.css';

const ComicProfileForm = () => {

  const [contentWarnings, setContentWarnings] = useState<any[]>([]);
  const [submissionError, setSubmissionError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState({
    name: '',
    subdomain: '',
    name: '',
    subdomain: '',
    description: '',
    genre: {},
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
      <div className="FlexRow">
        {contentWarnings.map((warning, idx) => {
          return (
            <div className="FlexGrow">
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
            </div>
          )}
        )}
      </div>

      <h2>Genres</h2>

      <Button id="new_comic" type="submit" onClick={submitComic} look="primary">
        Submit
      </Button>
    </CaveartLayout>
  )
}

export default ComicProfileForm;