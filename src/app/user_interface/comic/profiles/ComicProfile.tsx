import { Image, Link, Tag, Button, Modal, Form, TextInput, Tooltip } from '@components'
import { useCallback, useState } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';
import './ComicProfiles.css';

type ComicProfileProps = {
  tenant: string;
}

const ComicProfile: React.FC<ComicProfileProps> = ({
  tenant
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
                    <li key={`content-warning-${profile.content_warnings[key].name}`}>
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
      <div className="flex Row">
        <div className="flex-section">
          <a className="comic-profile_cover flex-section" href={`/read/${profile?.subdomain}`}>
            <Image src={profile.thumbnail || '/img/brand/kraugak.png'} />
          </a>
        </div>
        <div className="flex-section Grow">
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

        </div>
      </div>     
  )
  
}

export default ComicProfile;