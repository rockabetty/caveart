import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '../../../../component_library';
import ComicProfile from '../../../app/user_interface/comic/ComicProfile';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Comic, GenreSelection } from '../../../data/types';
import ComicProfileProvider from '../../../app/user_interface/comic/hooks/ComicProfileProvider'
import { useRouter } from 'next/router'

function ComicProfilePage() {

  const { t } = useTranslation();
  const router = useRouter()
 
  return (
    <CaveartLayout>
      <ComicProfileProvider>
      <ComicProfile
        comicId={router.query.comicId}
      />
      </ComicProfileProvider>
    </CaveartLayout>
  )
}

export default ComicProfilePage;