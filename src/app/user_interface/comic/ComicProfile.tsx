import { ImageUpload, Link, Button, Tag } from '../../../../component_library'
import './ComicProfile.css';
import { Comic, Genre } from '../../../data/types'
import GenreSelector, { GenreUserSelection } from './GenreSelector';
import ContentWarningSelector from './ContentWarningSelector';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentWarningUserSelection, useContentWarnings } from '../../../app/user_interface/comic/hooks/useContentWarnings';

interface ComicProfileProps {
  comicId: number;
}

interface ComicProfileUpdate extends Comic {
  genres: GenreUserSelection;
  content_warnings: ContentWarningUserSelection;
}

const ContentWarningSection: React.FC<{ selection: ContentWarningUserSelection}> = ({selection}) => {

  const {
    contentWarningsForDisplay,
    // TODO: put rating hoox back in when editing is enabled frfr?
    // ratingString,
    // ratingId, 
    // contentWarningUserSelection,
    onContentChange
  } = useContentWarnings(selection);

  return (
    <ContentWarningSelector
      onChange={onContentChange}
      options={contentWarningsForDisplay}
      selection={selection}
    />
  )
}

const ComicProfile: React.FC<ComicProfileProps> = ({comicId}: ComicProfileProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
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
    content_warnings: {}
  })

  useEffect(() => {
    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      setComicProfile(response.data)
      let genreUpdate: GenreUserSelection = {};
      let contentUpdate: ContentWarningUserSelection = {};
      for (let genre of response.data.genres) {
        const {id} = genre;
        genreUpdate[id] = true;
      }
      for (let label of response.data.content_warnings) {
        const {id, name} = label;
        contentUpdate[name] = id;
      }
      setComicUpdate({
        ...comicUpdate,
        content_warnings: contentUpdate,
        genres: genreUpdate
      });
    })
    .catch((error) => {
      console.error(error)
    })

    axios
      .get('/api/genres')
      .then((response) => {
        setGenres(response.data)
    });
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
        {comicProfile.rating}
        {editing 
          ? <GenreSelector
              options={genres}
              id={`genre-selection-${comicId}`}
              selection={comicUpdate.genres}
              onChange={onUpdateGenre}
            />
          : comicProfile.genres && Object.keys(comicProfile.genres).length > 0
              ? Object.keys(comicProfile.genres).map((label, idx) => (
                  <Tag
                    key={`genre-${comicId}-${idx}`}
                    id={`comic-${comicId}-genre-${idx}`}
                    label={label}
                  />
                ))
              : null
        }
        
        <p>
         {comicProfile.description}
        </p>

        {editing
          ? (<ContentWarningSection
              selection={comicProfile.content_warnings}
            />
            )
          : comicProfile.content_warnings && Object.keys(comicProfile.content_warnings).length > 0
              ? Object.keys(comicProfile.content_warnings).map((label, idx) => (
                  <Tag
                    key={`genre-${comicId}-${idx}`}
                    id={`comic-${comicId}-genre-${idx}`}
                    label={label}
                  />
                ))
              : null
         }
       
      </div>
    </div>
  )
}

export default ComicProfile;