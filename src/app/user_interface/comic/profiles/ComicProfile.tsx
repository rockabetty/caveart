import { ImageUpload, Link, Tag } from '@components'
import './ComicProfiles.css';
import { useCallback } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

type ComicProfileProps = {
  tenant: string
}

const ComicProfile: React.FC<ComicProfileProps> = (props) => {
  const { t } = useTranslation();
  const {tenant} = props;
  const {state} = useComicProfile(tenant);
  const {profile, permissions} = state;

  const renderGenres = useCallback(() => {
    const selectedGenres = profile?.genres 
    ? Object.values(profile.genres)
    : [];

    return (
      <>
      {selectedGenres.length === 0
        ? null
        : (<>
          {selectedGenres.map((value, idx) => {
            return (
              <Tag
                key={`browsing-genre-${tenant}-${idx}`}
                label={value.name}
              />
            )
          })}
          </>)
      }
      </>
    );
  }, [profile]);

  const renderContentWarnings = useCallback(() => {
    const contentWarnings = profile?.content_warnings 
    ? Object.keys(profile.content_warnings)
    : [];
   
    return (
      <>
      {contentWarnings.length === 0
        ? null
        : (<>
          {contentWarnings.map((key, idx) => {
            return (
              <Tag
                key={`browsing-content_warning-${tenant}-${idx}`}
                label={t(`contentWarnings.${key}.${profile.content_warnings[key].name}`)}
              />
            )
          })}
          </>)
      }
      </>
    );
  }, [profile]);


  return (
      <div className="comic-profile">
          <div className="comic-profile_body">
            <a className="comic-profile_cover" href={`/read/${profile?.subdomain}`}>
              {profile?.thumbnail
                ? <ImageUpload src={profile?.thumbnail} />
                : <ImageUpload src='/img/brand/kraugak.png' />
              }
            </a>
            <div>
             <div className="comic-profile_header">
                <h1 className="comic-profile_title">{profile?.title}</h1>
                  {permissions?.edit
                    ? (<>
                        <Link type="inline button" href={`/comic/${profile?.subdomain}/edit`} id={`edit-${profile?.subdomain}`}>{t('comicProfile.edit')}</Link>
                        <Link type="inline button" look="primary" href={`/comic/${profile?.subdomain}/pages/new`} id={`newpage-${profile?.subdomain}`}>{t('comicPages.add')}</Link>
                      </>
                      )
                    : null
                  }
              </div>
              <pre className="comic-profile_description">{profile?.description}</pre>
              <Tag label={profile?.rating} />
              {profile?.genres
                ? renderGenres()
                : null
              }
              {renderContentWarnings()}
            </div>
          </div>
      </div>
  )
}

export default ComicProfile;