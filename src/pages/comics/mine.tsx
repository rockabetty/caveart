import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '@components';
import AuthorComicEntry from '../../app/user_interface/comic/profiles/AuthorComicEntry';
import ComicProfile from '../../app/user_interface/comic/profiles/ComicProfile';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Comic } from '../../data/types';
import ComicProfileProvider from '../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'

function MyComics() {

  const { t } = useTranslation();

  const [comics, setComics] = useState<Comic[]>([]);
 
  useEffect(() => {
    axios.get('/api/comics/mine')
       .then((response) => {
         setComics(response.data)
       })
       .catch((error) => {
         console.error(error)
       })
  }, [])

  const renderComicEntries = function() {
    if (comics.length === 0 ) {
      return (
        <div>
          <p>{t('comicProfile.noComics')}</p>
          <Link type="button" look="primary" id="link-create_comic" href="/comic/new">{t('comicProfile.create')}</Link>
        </div>
      )
    }

    if (comics.length === 1) {
      const comic = comics[0];
      return (
        <ComicProfileProvider>
          <ComicProfile tenant={comic.subdomain} />
        </ComicProfileProvider>
      )
    }

    return (
      <>
       {comics.map((comic, idx) => {
        return (
          <ComicProfileProvider key={`comicProfile-${idx}`}>
          <AuthorComicEntry
            tenant={comic.subdomain}
          />
          </ComicProfileProvider>
        )
      })}
       </>
      )
  }
 
  return (
    <CaveartLayout requireLogin={true}>
      <h1>{t('headerNavigation.myWebcomics')}</h1>
      <Link type="button" id="link-create_comic" href="/comic/new">{t('comicProfile.create')}</Link>
      {renderComicEntries()}
    </CaveartLayout>
  )
}

export default MyComics;