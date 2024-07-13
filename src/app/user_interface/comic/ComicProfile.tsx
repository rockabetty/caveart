import { ImageUpload, Link, Button, Badge, Form, TextArea, TextInput, Tag, ButtonSet } from '../../../../component_library'
import './ComicProfiles.css';
import GenreSelector, { GenreUserSelection } from './GenreSelector';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ComicProfileEditor from './ComicProfileEditor';
import { useComicProfile } from './hooks/useComicProfile'; 
import ComicProfileProvider from './hooks/ComicProfileProvider';
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

const ComicProfile: React.FC<ComicProfileProps> = (props: ComicProfileProps) => {
  const { t } = useTranslation();
  const {comicId} = props;
  const {state, loadProfile, getUserPermissions} = useComicProfile(comicId);
  const {profile, permissions, update} = state;
 
  useEffect(() => {
    loadProfile()
    getUserPermissions()
  }, [])

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
                key={`browsing-genre-${comicId}-${idx}`}
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

    console.log(profile.content_warnings)

   
    return (
      <>
      {contentWarnings.length === 0
        ? null
        : (<>
          {contentWarnings.map((key, idx) => {
            return (
              <Tag
                key={`browsing-content_warning-${comicId}-${idx}`}
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
        <div className="comic-profile_header">
          <h1 className="comic-profile_title">{profile?.title}</h1>
            {permissions?.edit
              ? <Badge showLabel id={`edit-${profile?.subdomain}`} icon="edit" label="Edit profile" />
              : null
            }
        </div>
      
          <div className="comic-profile_body">
            <a className="comic-profile_cover" href={`/read/${comicId}`}>
              {profile?.thumbnail
                ? <ImageUpload src={`/${profile?.thumbnail}`} />
                : <ImageUpload src='/img/brand/kraugak.png' />
              }
            </a>
            <div>
              <Link href={`/comic/${profile?.subdomain}`}>{profile?.subdomain}.caveartwebcomics.com</Link>  
              <pre>{profile?.description}</pre>
              <Tag label={profile?.rating} />
              {renderGenres()}
              {renderContentWarnings()}
            </div>
          </div>
      </div>
  )
}

export default ComicProfile;