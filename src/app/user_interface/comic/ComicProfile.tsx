import { ImageUpload, Link, Button, Tag } from '../../../../component_library'
import './ComicProfile.css';
import { Comic } from '../../../data/types'
import GenreSelection, { Genre, GenreUserSelection } from './GenreSelection';
import ContentWarningSelector from './ContentWarningSelector';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentWarningUserSelection, useContentWarnings } from '../../../app/user_interface/comic/hooks/useContentWarnings';

interface ComicProfileProps {
  comicId: number;
  genres: GenreUserSelection;
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

  const [genreUpdate, setGenreUpdate] = useState<GenreUserSelection | undefined>(undefined);

  useEffect(() => {

    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      setComicProfile(response.data)
      setGenreUpdate(response.data.genres);
    })
    .catch((error) => {
      console.error(error)
    })    
  },[]);

  const handleEdit = function() {
    if (editing) {
      axios.post(`/api/comics/${comicId}/genres`, {
        current: comicProfile.genres,
        update: genreUpdate
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((error: any) => {
        console.error(error)
      })
    }
    setEditing(!editing);
  }

  const onUpdateGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);
    const newGenres: GenreUserSelection = { ...genreUpdate };
    if (newGenres[currentValue]) {
      delete newGenres[currentValue];
    } else {
      newGenres[currentValue] = genres[currentValue];
    };
    setGenreUpdate(newGenres);
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
          comicProfileGenres={genreUpdate}
          allGenreChoices={genres}
          onChange={onUpdateGenre}
          id={comicId}
          parentIsEditing={editing}
        />
        
        <p>
         {comicProfile.description}
        </p>

        
      </div>
    </div>
  )
}

export default ComicProfile;