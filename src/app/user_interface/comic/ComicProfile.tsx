import { ImageUpload, Link, Button, TextArea, TextInput } from '../../../../component_library'
import './ComicProfile.css';
import GenreSelection, { GenreUserSelection } from './GenreSelection';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ComicProfileProps {
  comicId: number;
  genres: GenreUserSelection;
}

interface ComicData {
  id: string;
  genres: GenreUserSelection;
  description: string;
  title: string;
  subdomain: string;
  thumbnail: string;
  rating: string;
}

type ComicTextInputField = Extract<keyof ComicData, 'title' | 'description' | 'subdomain'>;

const emptyProfile: ComicData = {
    id: '',
    genres: {},
    title: '',
    description: '',
    subdomain: '',
    rating: '',
    thumbnail: ''
}

const ComicProfile: React.FC<ComicProfileProps> = (props: ComicProfileProps) => {

  const {genres, comicId} = props;

  const [editing, setEditing] = useState<boolean>(false);
  const [comicProfile, setComicProfile] = useState<ComicData>(emptyProfile);
  const [comicUpdate, setComicUpdate] = useState<ComicData>(emptyProfile);

  useEffect(() => {
    axios.get(`/api/comic/${comicId}`)
    .then((response) => {
      setComicProfile(response.data)
      setComicUpdate(response.data)
    })
    .catch((error) => {
      console.error(error)
    })    
  },[]);

  const handleEdit = function() {
    if (editing) {
      axios.post(`/api/comics/${comicId}/genres`, {
        current: comicProfile.genres,
        update: comicUpdate.genres
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
    const newGenres: GenreUserSelection = { ...comicUpdate.genres };
    if (newGenres[currentValue]) {
      delete newGenres[currentValue];
    } else {
      newGenres[currentValue] = genres[currentValue];
    };
    setComicUpdate({...comicUpdate, genres: newGenres});
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key: ComicTextInputField = name as ComicTextInputField;
    setComicUpdate(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="comic-profile">
      <a href={`/read/${comicId}`}>
        {comicProfile.thumbnail
          ? <ImageUpload src={`/${comicProfile.thumbnail}`} />
          : <ImageUpload src='/img/brand/kraugak.png' />
        }
      </a>
      <div className="FullWidth">
        {editing
          ? (
              <div>
                <TextInput
                  onChange={onTextChange}
                  labelText="Title"
                  id={`title-edit-${comicId}`}
                  name="title"
                  value={comicUpdate?.title}
                 />
                 <TextInput
                  onChange={onTextChange}
                  labelText="Subdomain"
                  name="subdomain"
                  id={`subdomain-edit-${comicId}`}
                  value={comicUpdate?.subdomain}
                 />
                <TextArea
                  onChange={onTextChange}
                  labelText="Description"
                  name="description"
                  id={`description-edit-${comicId}`}
                  value={comicUpdate?.description}
                />
              </div>
            )
          : (
              <div>
                <h1>{comicProfile.title}</h1>
                <Link href={`/comic/${comicProfile.subdomain}`}>{comicProfile.subdomain}.caveartwebcomics.com</Link>  
                <div>{comicProfile.description}</div>
              </div>
            )
        }

        <GenreSelection
          comicProfileGenres={comicUpdate?.genres}
          allGenreChoices={genres}
          onChange={onUpdateGenre}
          id={comicProfile.subdomain}
          parentIsEditing={editing}
        />

        <Button
          id={`edit-comic-${comicProfile.id}`}
          onClick={handleEdit}
        >
          {editing ? 'Save' : 'Edit'}
        </Button>
      </div>
    </div>
  )
}

export default ComicProfile;