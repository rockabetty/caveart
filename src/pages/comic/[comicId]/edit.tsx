import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import EditComicProfile from '../../../app/user_interface/comic/profiles/EditComicProfile';
import ComicProfileProvider from '../../../app/user_interface/comic/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';
import axios from 'axios';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function EditComic() {

  const { t } = useTranslation();
  const { comicId } = useRouter().query;
  
  return (
  <CaveartLayout requireLogin={true}>
    <h1>{t('comicManagement.edit')}</h1>
      <ComicProfileProvider>
        <EditComicProfile
          comicId={comicId}
        />
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default EditComic;