import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import EditComicProfile from '../../../app/user_interface/comic/EditComicProfile';
import ComicProfileProvider from '../../../app/user_interface/comic/hooks/ComicProfileProvider'
import { useRouter } from 'next/router';
import { useTranslation} from 'react-i18next';

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
          comicId={comicId || -1}
        />
      </ComicProfileProvider>
   </CaveartLayout>
  )
}

export default EditComic;