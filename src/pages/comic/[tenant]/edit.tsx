import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import EditComicProfile from '../../../app/user_interface/comic/profiles/EditComicProfile';
import ComicProfileProvider from '../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';

function EditComic() {

  const { t } = useTranslation();
  const { tenant } = useRouter().query;
  
  return (
  <CaveartLayout requireLogin={true}>
    <h1>{t('comicManagement.edit')}</h1>
      <ComicProfileProvider>
        <EditComicProfile
          tenant={tenant}
        />
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default EditComic;