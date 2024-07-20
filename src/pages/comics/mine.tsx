import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '@components';
import ComicProfile from '../../app/user_interface/comic/profiles/ComicProfile';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Comic, GenreSelection } from '../../data/types';
import ComicProfileProvider from '../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'

function MyComics() {

  const { t } = useTranslation();

  const [comics, setComics] = useState<Comic[]>([]);
 
  useEffect(() => {
    axios.get('/api/comics/mine')
       .then((response) => {
        console.log(response)
         setComics(response.data)
       })
       .catch((error) => {
         console.error(error)
       })
  }, [])
 
  return (
    <CaveartLayout requireLogin={true}>
      <h1>{t('headerNavigation.myWebcomics')}</h1>
   
        {comics
          ? comics.map((comic, idx) => {
            return (
              <ComicProfileProvider key={`comicProfile-${idx}`}>
              <ComicProfile
                comicId={comic.id || -1}
              />
              </ComicProfileProvider>
            )
          })
          : <p>{t('comicProfile.noComics')}</p>
        }

      <Link type="button" id="link-create_comic" href="/comic/new">{t('comicProfile.create')}</Link>
    </CaveartLayout>
  )
}

export default MyComics;