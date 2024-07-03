import { ImageUpload, Link, Tag } from '../../../../component_library'
import './ComicProfile.css';
import { ComicModel } from '../../../types/comics';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ComicProfileProps {
  comicId: number;
  subdomain: string
}

const ComicProfile: React.FC<ComicProfileProps> = ({comicId, subdomain}: ComicProfileProps) => {
  useEffect(() => {
    console.log(comicId)
    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      console.log(response.data)
      setComicProfile(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
  },[]);

  const [comicProfile, setComicProfile] = useState({})

  return (
    <div className="comic-profile">
      <a href={`/read/${comicId}`}>
        {comicProfile.thumbnail
          ? <ImageUpload src={comicProfile.thumbnail} />
          : <ImageUpload src='/img/brand/kraugak.png' />
        }
      </a>
      <div>
        <h1>
        {comicProfile.title}
        </h1>
        <div>
          {comicProfile.rating}
          {comicProfile.content_warnings
            ? comicProfile.content_warnings.map((contentLabel) => <Tag filterName="content_warnings" id={contentLabel.name} removable label={contentLabel.name} />)
            : null
          }
        </div>
        <p>
         {comicProfile.description}
        </p>
        <Link id="link-add_pages" href={`pages/new`}>Add pages</Link>
        <Link id="link-edit" href={`edit/${subdomain}`}>Edit</Link>
      </div>
    </div>
  )
}

export default ComicProfile;