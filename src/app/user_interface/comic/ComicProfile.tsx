import { ImageUpload, Link, Button, Tag } from '../../../../component_library'
import './ComicProfile.css';
import { ComicModel } from '../../../types/comics';
import GenreSelector from './GenreSelector';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ComicProfileProps {
  comicId: number;
  subdomain: string
}

const ComicProfile: React.FC<ComicProfileProps> = ({comicId, subdomain}: ComicProfileProps) => {

  const [editing, setEditing] = useState<boolean>(false);
  const [comicProfile, setComicProfile] = useState({
    genres: [],
    content_warnings: [],
    name: '',
    description: '',
    thumbnail: null
  });
  const [comicUpdate, setComicUpdate] = useState({
    genres: {}
  })

  useEffect(() => {
    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      setComicProfile(response.data)
      let genreUpdate = {}
      for (let genre of response.data.genres) {
        const {id, name} = genre;
        genreUpdate[id] = true;
      }
      setComicUpdate({...comicUpdate, genres: genreUpdate});
    })
    .catch((error) => {
      console.error(error)
    })
  },[]);

  const handleEdit = function() {
    setEditing(!editing);
  }

  const onUpdateGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);
    const currentGenres: GenreSelection = { ...comicUpdate.genres };
    console.log(currentGenres);
    if (currentGenres[currentValue]) {
      delete currentGenres[currentValue];
    } else {
      currentGenres[currentValue] = true;
    }
    const updatedGenres = {
      ...comicProfile,
      genres: currentGenres
    };
    setComicUpdate(updatedGenres);
  };

  return (
    <div className="comic-profile">
      <a href={`/read/${comicId}`}>
        {comicProfile.thumbnail
          ? <ImageUpload src={`/${comicProfile.thumbnail}`} />
          : <ImageUpload src='/img/brand/kraugak.png' />
        }
      </a>
      <div>
        <h1>
        {comicProfile.title}
        </h1>
        <div>
          <Link id="link-add_pages" href={`pages/new`}>Add pages</Link>
          <Button
            id={`edit-comic-${comicProfile.id}`}
            onClick={handleEdit}
          >
            {editing ? 'Save' : 'Edit'}
          </Button>
        </div>
        {comicProfile.rating}
        {editing 
          ? <GenreSelector
            id={`genre-selection-${comicId}`}
            selection={comicUpdate.genres}
            onChange={onUpdateGenre}
          />
          : null
        }
          {comicProfile.content_warnings
            ? comicProfile.content_warnings.map((contentLabel, idx) => <Tag key={`tag-${comicId}-${idx}`} id={contentLabel.name} label={contentLabel.name} />)
            : null
          }
        <p>
         {comicProfile.description}
        </p>
       
      </div>
    </div>
  )
}

/*
 comicProfile.genres
              ? comicProfile.genres.map((genre, idx) => <Tag key={`tag-${comicId}-${idx}`} id={genre.name} label={genre.name} />)
              : null
*/

export default ComicProfile;