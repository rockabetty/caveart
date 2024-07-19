import CaveartLayout from '../../../../app/user_interface/CaveartLayout'
import ComicProfileProvider from '../../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';
import axios from 'axios';
import { ImageUpload } from '@components';
import { useEffect, useState } from 'react';

function AddPage() {
  const router = useRouter()
  const {comicId} = router.query;
  const { t } = useTranslation();
 
  useEffect(() => {
    axios.get(`api/comic/${comicId}/pages/next`)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

  }, [])

  
  return (
  <CaveartLayout requireLogin={true}>
    <h1>{t('comicManagement.addPage')}</h1>
      <ComicProfileProvider>
      <ImageUpload
        id="new"
      />
        
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default AddPage