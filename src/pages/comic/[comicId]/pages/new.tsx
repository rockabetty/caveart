import CaveartLayout from '../../../../app/user_interface/CaveartLayout'
import ComicProfileProvider from '../../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';
import axios from 'axios';
import { Form, ImageUpload, TextArea } from '@components';
import { useEffect, useState } from 'react';

function AddPage() {
  const router = useRouter()
  const {comicId} = router.query;
  console.log(comicId)
  const { t } = useTranslation();
  const [upload, setUpload] = useState({
    newPageNumber: 0,
    file: undefined
  })
  const [timezone, setTimezone] = useState("")
 
  useEffect(() => {
    if (comicId) {
      axios.get(`/api/comic/${comicId}/pages/next`)
      .then((response) => {
        const {newPageNumber} = response.data;
        setUpload({...upload, newPageNumber})
      })
      .catch((error) => {
        console.log(error)
      })

      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [comicId])

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const handleTextChange = () => {
    console.log("bosom")
  }

  const handleSubmit = () => {
    console.log('lol')
  }

  return (
  <CaveartLayout requireLogin={true}>
    <h1>{t('comicManagement.addPage')}</h1>
      <ComicProfileProvider>
      <p>Next page number: {upload.newPageNumber}</p>
      <Form
        submitLabel='Create page'
        formValues={upload}
        onSubmit={handleSubmit}
      >
        <ImageUpload
          required
          id="new"
          labelText="Upload your comic image"
          editable
          value={upload.file}
          maxSize={3000 * 1024}
        />

        <TextArea
          id="author_comment"
          labelText="Author comment"
          value={upload.commentary}
          onChange={handleTextChange}
        />

      </Form>
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

/*
Todo - chapters, release scheduling.

CREATE TABLE IF NOT EXISTS comic_pages (
    id SERIAL PRIMARY KEY,
    page_number INT,
    img TEXT NOT NULL UNIQUE,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    release_on TIMESTAMP DEFAULT NOW(),
    UNIQUE (comic_id, chapter_id, page_number),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    author_comment TEXT
);
*/

export default AddPage