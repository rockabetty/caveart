import CaveartLayout from '../../app/user_interface/CaveartLayout'
import NewComicForm from '../../app/user_interface/comic/profiles/NewComicForm';
import ComicProfileProvider from '../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useTranslation} from 'react-i18next';

function NewComic() {

  const { t } = useTranslation();
  
  return (
  <CaveartLayout requireLogin={true}>
    <div className="tile">
      <h1>{t('comicProfile.create')}</h1>
      <ComicProfileProvider>
        <NewComicForm
        />
      </ComicProfileProvider>
    </div>
   </CaveartLayout>
  )
}

export default NewComic;