import { ImageUpload, Link, Button, Badge, TextArea, TextInput, ButtonSet } from '../../../../component_library'
import './ComicProfile.css';
import GenreSelection, { GenreUserSelection } from './GenreSelection';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ComicProfileEditor from './ComicProfileEditor';

interface ComicProfileProps {
  comicId: number;
  genres: GenreUserSelection;
}

export type ComicData = {
  id: string;
  genres: GenreUserSelection;
  description: string;
  title: string;
  subdomain: string;
  thumbnail: string;
  rating: string;
}

export type ComicTextInputField = Extract<keyof ComicData, 'title' | 'description' | 'subdomain'>;

export const emptyProfile: ComicData = {
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
  const [canEdit, setCanEdit] = useState<boolean>(false);
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

    axios.get(`/api/comics/${comicId}/permissions`)
      .then((response) => {
        setCanEdit(response.data?.edit)
      })
      .catch((error) => {
        console.error(error);
      })
  },[]);

  const submitEdit = function() {
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
    setEditing(false);
  }

  const cancelEdit = function () {
    setComicUpdate(comicProfile);
    setEditing(false);
  }

  const startEdit = function () {
    setEditing(true);
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
      <a className="comic-profile_cover" href={`/read/${comicId}`}>
        {comicProfile.thumbnail
          ? <ImageUpload src={`/${comicProfile.thumbnail}`} />
          : <ImageUpload src='/img/brand/kraugak.png' />
        }
      </a>
      <div className="FullWidth">
        {editing
          ? <ComicProfileEditor
              id={comicId}
              profile={comicUpdate}
              onTextChange={onTextChange}
              genres={genres}
              onUpdateGenre={onUpdateGenre}
            />
          : (
              <div>
                <h1>{comicProfile.title}</h1>
                <Link href={`/comic/${comicProfile.subdomain}`}>{comicProfile.subdomain}.caveartwebcomics.com</Link>  
                <div>{comicProfile.description}</div>
                <GenreSelection
                  comicProfileGenres={comicUpdate?.genres}
                  allGenreChoices={genres}
                  onChange={onUpdateGenre}
                  id={comicProfile.subdomain}
                  parentIsEditing={false}
                />
              </div>
            )
        }

        {canEdit 
          ? editing
            ? (<div className="flexrow FlushRight">
                <ButtonSet>
                  <Button inline onClick={cancelEdit} id={`cancel-edit-${comicProfile.subdomain}`}>Cancel editing</Button>
                  <Button inline look="primary" onClick={submitEdit} id={`submit-edit-${comicProfile.subdomain}`}>Save changes</Button>
                </ButtonSet>
              </div>
              )
            : <Badge onClick={startEdit} showLabel id={`edit-${comicProfile.subdomain}`} icon="edit" label="Edit profile" />
          : null
        }
      </div>
    </div>
  )
}

export default ComicProfile;