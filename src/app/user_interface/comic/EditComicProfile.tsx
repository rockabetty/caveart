import { ImageUpload, Link, Tag, LoadingSpinner } from '../../../../component_library'
import './ComicProfiles.css';
import { useEffect, useCallback } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

export const emptyProfile: ComicData = {
    id: '',
    genres: {},
    content_warnings: {},
    title: '',
    description: '',
    subdomain: '',
    rating: '',
    thumbnail: ''
}

const EditComicProfile: React.FC<ComicProfileProps> = (props: ComicProfileProps) => {
  const { t } = useTranslation();
  const {comicId} = props;
  const {state, getUserPermissions} = useComicProfile(comicId);
  const {permissions} = state;
 
  // useEffect(() => {
  //   getUserPermissions()
  // }, [])

  if (permissions === undefined) {
    return <LoadingSpinner />
  }

  if (permissions?.edit === false) {
    return (<div>{t('statusCodes.403')}</div>)
  }

  return (
    <div className="comic-profile">
        {permissions.edit}
        <div className="comic-profile_body">
          <a className="comic-profile_cover" href={`/read/${profile?.subdomain}`}>
            {profile?.thumbnail
              ? <ImageUpload src={`/${profile?.thumbnail}`} />
              : <ImageUpload src='/img/brand/kraugak.png' />
            }
          </a>
          <div>
           <div className="comic-profile_header">
              <h1 className="comic-profile_title">{profile?.title}</h1>
                {permissions?.edit
                  ? <Link type="inline button" href={`/comic/${comicId}/edit`} id={`edit-${profile?.subdomain}`}>{t('comicManagement.edit')}</Link>
                  : null
                }
            </div>
            <pre className="comic-profile_description">{profile?.description}</pre>
            <Tag label={profile?.rating} />
            {renderGenres()}
            {renderContentWarnings()}
          </div>
        </div>
    </div>
  )
}

export default EditComicProfile;