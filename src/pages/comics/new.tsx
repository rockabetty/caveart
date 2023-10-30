import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextArea, TextInput, Button, Accordion } from '../../../component_library';
import CaveartLayout from '../../app/user_interface/CaveartLayout'

const ComicProfileForm = () => {

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


    </CaveartLayout>
  )
}

export default ComicProfileForm;