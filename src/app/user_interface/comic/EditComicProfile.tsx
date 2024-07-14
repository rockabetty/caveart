import { Form, LoadingSpinner, TextInput, TextArea } from '../../../../component_library'
import './ComicProfiles.css';
import { useEffect, useState, useCallback } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import GenreSelector from './GenreSelector';
import ContentWarningSelector from './ContentWarningSelector';
import { useTranslation } from 'react-i18next';

const EditComicProfile: React.FC<ComicProfileProps> = (props: ComicProfileProps) => {
  const { t } = useTranslation();
  const {comicId} = props;
  const {state,
    getUserPermissions,
    enableEditing,
    onTextChange,
  } = useComicProfile(comicId);
  const {profile, update, permissions} = state;

  useEffect(() => {
    getUserPermissions()
    enableEditing()
  }, [comicId])

  if (permissions === undefined) {
    return <LoadingSpinner />
  }

  if (permissions?.edit === false) {
    return (<div>{t('statusCodes.403')}</div>)
  }

  return (
    <div className="comic-profile">
      <Form
        id={`editform-${comicId}`}
        formValues={update}
      >
        <h2>Basic Info</h2>
        <TextInput
          labelText="Title"
          id={`title-edit-${comicId}`}
          pattern="^[a-zA-Z0-9 !:_\-?]+$"
          placeholderText="Unga Bunga: The Grungas of Wunga"
          name="title"
          required
          value={update?.title}
        />
        <TextInput
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
          labelText="Description"
          name="description"
          placeholderText="Tell us about your comic!"
          id={`description-edit-${comicId}`}
          value={update?.description}
        />
        <h2>Genres</h2>
        <GenreSelector
          comicProfileGenres={update?.genres}
        />
        <h2>Content Warnings</h2>
        <p>Help users filter out unwanted content (such as for personal preferences, NSFW controls, and so on) by selecting any content warning labels that apply.
        </p>
        <ContentWarningSelector
          selection={update?.content_warnings}
        />
      </Form>
    </div>
  )
}
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