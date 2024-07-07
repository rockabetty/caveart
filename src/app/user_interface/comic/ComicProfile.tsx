import { ImageUpload, Link, Button, Tag } from '../../../../component_library'
import './ComicProfile.css';
import { Comic } from '../../../data/types'
import GenreSelection, { Genre } from './GenreSelection';
import ContentWarningSelector from './ContentWarningSelector';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentWarningUserSelection, useContentWarnings } from '../../../app/user_interface/comic/hooks/useContentWarnings';

interface ComicProfileProps {
  comicId: number;
  genres: Genre[];
}

const ComicProfile: React.FC<ComicProfileProps> = (props: ComicProfileProps) => {

  const {genres, comicId} = props;

  const [editing, setEditing] = useState<boolean>(false);
  const [comicProfile, setComicProfile] = useState<ComicProfileUpdate>({
    genres: {},
    content_warnings: {},
    title: '',
    description: '',
    rating: '',
  });

  const [comicUpdate, setComicUpdate] = useState({
    genres: {},
  })

  useEffect(() => {

    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      setComicProfile(response.data)
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
    const currentGenres: GenreUserSelection = { ...comicUpdate.genres };
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
        <GenreSelection
          comicProfileGenres={comicProfile.genres}
          allGenreChoices={genres}
          parentIsEditing={editing}
          onChange={onUpdateGenre}
          id={comicId}
        />
        
        <p>
         {comicProfile.description}
        </p>

        
      </div>
    </div>
  )
}

export default ComicProfile;