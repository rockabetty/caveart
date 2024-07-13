import { ImageUpload, Link, Button, Badge, Form, TextArea, TextInput, Tag, ButtonSet } from '../../../../component_library'
import './ComicProfiles.css';
import GenreSelector, { GenreUserSelection } from './GenreSelector';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ComicProfileEditor from './ComicProfileEditor';
import { loadProfile } from './hooks/comicProfileFunctions'; 
import { reducer } from './hooks/comicProfileReducer'; 

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

  let comicProfile = {};
  const {comicId} = props;

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <div className="comic-profile">
      <div className="comic-profile_header">
        <h1 className="comic-profile_title">Title</h1>
          <Badge showLabel id={`edit-${comicProfile?.subdomain}`} icon="edit" label="Edit profile" />
      </div>
    
        <div className="comic-profile_body">
          <a className="comic-profile_cover" href={`/read/${comicId}`}>
            {comicProfile?.thumbnail
              ? <ImageUpload src={`/${comicProfile.thumbnail}`} />
              : <ImageUpload src='/img/brand/kraugak.png' />
            }
          </a>
          <div>
            <Link href={`/comic/${comicProfile.subdomain}`}>{comicProfile?.subdomain}.caveartwebcomics.com</Link>  
            <pre>{comicProfile?.description}</pre>
            <Tag label={comicProfile?.rating} />
          </div>
        </div>
    </div>
  )
}

export default ComicProfile;