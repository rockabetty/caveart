import { ImageUpload, Link, Tag, Button, Modal, Form, TextInput, Tooltip } from '@components'
import './ComicProfiles.css';
import { useCallback, useState } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

type ComicProfileProps = {
  tenant: string;
  onDelete: (event) => void
}

const ComicProfile: React.FC<ComicProfileProps> = ({
  tenant,
  onDelete
}) => {
  const { t } = useTranslation();
  const {state, removeComic} = useComicProfile(tenant);
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
        : (
          <div>
          <Tooltip
            label={profile?.rating}
            content={
              <ul>
                {contentWarnings.map((key, idx) => {
                  return (
                    <li>
                      {t(`contentWarnings.${key}.${profile.content_warnings[key].name}`)}
                    </li>
                  )
                })}
              </ul>
            }
          />
          </div>
          )
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
            <Link href={`/read/${profile?.subdomain}`}>caveartcomics.com/read/{profile?.subdomain}</Link>
          </div>
          <pre className="comic-profile_description">{profile?.description}</pre>
          {renderContentWarnings()}
           {profile?.genres
            ? renderGenres()
            : null
          }
          {permissions?.edit
            ? (<>
                <Link
                  type="button" 
                  look="default" 
                  href={`/comic/${profile?.subdomain}/edit`} 
                  id={`edit-${profile?.subdomain}`}
                >
                  {t('comicProfile.edit')}
                </Link>
                <Button 
                  look="warning" 
                  id={`delete_comic-${profile.id}`} 
                  inline 
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </>
              )
            : null
          }
        </div>
      </div>     
    </div>
  )
  
}

export default ComicProfile;