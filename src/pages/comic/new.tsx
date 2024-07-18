import CaveartLayout from '../../app/user_interface/CaveartLayout'
import NewComicForm from '../../app/user_interface/comic/profiles/NewComicForm';
import ComicProfileProvider from '../../app/user_interface/comic/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';
import axios from 'axios';

function NewComic() {

  const { t } = useTranslation();
  
  return (
  <CaveartLayout requireLogin={true}>
    <h1>{t('comicManagement.create')}</h1>
      <ComicProfileProvider>
        <NewComicForm
        />
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default NewComic;