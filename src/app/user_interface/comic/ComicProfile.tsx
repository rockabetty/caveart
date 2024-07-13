import { ImageUpload, Link, Button, Badge, Form, TextArea, TextInput, Tag, ButtonSet } from '../../../../component_library'
import './ComicProfiles.css';
import GenreSelector, { GenreUserSelection } from './GenreSelector';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ComicProfileEditor from './ComicProfileEditor';
import { useComicProfile } from './hooks/useComicProfile'; 
import ComicProfileProvider from './hooks/ComicProfileProvider';

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
  const {comicId} = props;
  const {state, loadProfile} = useComicProfile(comicId);
  const {profile, update} = state;

  useEffect(() => {
    loadProfile()
  }, [])

  return (
      <div className="comic-profile">
        <div className="comic-profile_header">
          <h1 className="comic-profile_title">{profile?.title}</h1>
            <Badge showLabel id={`edit-${profile?.subdomain}`} icon="edit" label="Edit profile" />
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
            </div>
          </div>
      </div>
  )
}

export default ComicProfile;