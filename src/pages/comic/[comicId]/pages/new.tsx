import CaveartLayout from '../../../../app/user_interface/CaveartLayout'
import ComicProfileProvider from '../../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';
import axios from 'axios';
import { Form, ImageUpload, TextArea } from '@components';
import { useEffect, useState } from 'react';
import DateTimepicker from '@components/Form/DateTimepicker';

type NewPageSubmission = {
  image?: FileList | File,
  newPageNumber: number,
  releaseDate: Date,
  commentary?: string
}

function AddPage() {
  const router = useRouter()
  const {comicId} = router.query;
  console.log(comicId)
  const { t } = useTranslation();
  const [upload, setUpload] = useState<NewPageSubmission>({
    newPageNumber: 0,
    image: undefined,
    releaseDate: new Date()
  })
 
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
    }
  }, [comicId])

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)


  const handleCommentaryChange= (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setUpload({...upload, commentary: value});
    console.log(upload)
  };

  const handleImageChange = (file: FileList) => {
    setUpload({...upload, image: file})
  }

  const handleSubmit = () => {
    console.log('lol')
  }

  const handleDateChange = (date: Date) => {
    setUpload({...upload, releaseDate: date})
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
          onChange={handleImageChange}
        />

        <TextArea
          id="author_comment"
          name="commentary"
          labelText="Author comment"
          placeholderText="Tell us about your favorite part of this page, your process, or whatever comes to mind."
          value={upload.commentary}
          onChange={handleCommentaryChange}
        />

        <DateTimepicker
          labelText="Release date"
          onDateChange={handleDateChange}
        />

      </Form>
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default AddPage