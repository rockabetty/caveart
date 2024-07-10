import CaveartLayout from '../../app/user_interface/CaveartLayout'
import {useEffect, useState} from 'react';
import {Link} from '../../../component_library';
import ComicProfile from '../../app/user_interface/comic/ComicProfile';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Comic, GenreSelection } from '../../data/types';

function MyComics() {

  const { t } = useTranslation();

  const [comics, setComics] = useState<Comic[]>([]);
  const [genres, setGenres] = useState<GenreSelection>({});

  useEffect(() => {
    axios.get('/api/comics/mine')
      .then((response) => {
        console.log(response.data)
       setComics(response.data)
      })

    axios.get('/api/genres')
      .then((response) => {
        setGenres(response.data)
      })
      .catch((error: any) => {
        console.error(error);
      })
  }, [])
 
  return (
    <CaveartLayout requireLogin={true}>
    <h1>{t('headerNavigation.myWebcomics')}</h1>
   
    {comics
      ? comics.map((comic, idx) => {
        return (
          <ComicProfile
            key={`comic-${idx}`}
            comicId={comic.id || -1}
            genres={genres}
          />
        )
      })
      : <p>{t('comicManagement.noComics')}</p>
    }

      <Link type="button" id="link-create_comic" href="new">{t('comicManagement.create')}</Link>
     </CaveartLayout>
  )
}

export default MyComics;