import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import ComicProfile from '../../../app/user_interface/comic/profiles/ComicProfile';
import ComicProfileProvider from '../../../app/user_interface/comic/profiles/hooks/ComicProfileProvider'
import { useRouter } from 'next/router'

function ComicProfilePage() {

  const router = useRouter()
 
  return (
    <CaveartLayout>
      <ComicProfileProvider>
      <ComicProfile
        comicId={router.query.tenant}
      />
      </ComicProfileProvider>
    </CaveartLayout>
  )
}

export default ComicProfilePage;