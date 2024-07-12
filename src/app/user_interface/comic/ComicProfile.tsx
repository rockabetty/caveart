import { ImageUpload, Link, Button, Badge, Form, TextArea, TextInput, Tag, ButtonSet } from '../../../../component_library'
import './ComicProfiles.css';
import GenreSelector, { GenreUserSelection } from './GenreSelector';
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
  const [submissionError, setSubmissionError] = useState<string>("");

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

  const submitEdit = async function() {
    const updates: Promise[] = [];
    setSubmissionError("");

    updates.push(
      axios.post(`/api/comics/${comicId}/genres`, {
        current: comicProfile.genres,
       update: comicUpdate.genres
      })
    )

    if (comicProfile.title !== comicUpdate.title) {
      updates.push(axios
        .post(`/api/comics/${comicId}/title`,
        {update: comicUpdate.title})
      )
    }

    if (comicProfile.subdomain !== comicUpdate.subdomain) {
      updates.push(axios
        .post(`/api/comics/${comicId}/subdomain`,
        {update: comicUpdate.subdomain})
      )
    }

    if (comicProfile.description !== comicUpdate.description) {
      updates.push(axios
        .post(`/api/comics/${comicId}/description`,
        {update: comicUpdate.description})
      )
    }

    try {
      await Promise.all(updates);
      setComicProfile(comicUpdate);
      setEditing(false);
    } catch (error: any) {
      console.log(error)
      const {message} = error.response?.data
      setSubmissionError(message)
    }
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

  const onFileChange = (files: FileList | undefined) => {
    setFormValues({
      ...formValues,
      thumbnail: files
    }) 
  };

  return (
    <div className="comic-profile">
      <div className="comic-profile_header">
        <h1 className="comic-profile_title">{comicProfile.title}</h1>
        {canEdit && !editing 
          ? <Badge onClick={startEdit} showLabel id={`edit-${comicProfile.subdomain}`} icon="edit" label="Edit profile" />
          : null
        }
      </div>
    
        {editing
          ?(<Form
              id={`editform-${comicId}`}
              onSubmit={submitEdit}
              submissionError={submissionError}
              submitLabel="Save"
              formValues={comicUpdate}
              cancelLabel="Cancel"
              onCancel={cancelEdit}
            >
              <ComicProfileEditor
                id={comicId}
                profile={comicUpdate}
                onTextChange={onTextChange}
                genres={genres}
                onUpdateGenre={onUpdateGenre}
              />
            </Form>
            )
          : (
              <div className="comic-profile_body">
                <a className="comic-profile_cover" href={`/read/${comicId}`}>
                  {comicProfile.thumbnail
                    ? <ImageUpload src={`/${comicProfile.thumbnail}`} />
                    : <ImageUpload src='/img/brand/kraugak.png' />
                  }
                </a>
                <div>
                  <Link href={`/comic/${comicProfile.subdomain}`}>{comicProfile.subdomain}.caveartwebcomics.com</Link>  
                  <pre>{comicProfile.description}</pre>
                  <Tag label={comicProfile.rating} />
                  <GenreSelector
                    comicProfileGenres={comicUpdate?.genres}
                    allGenreChoices={genres}
                    onChange={onUpdateGenre}
                    id={comicProfile.subdomain}
                    editing={false}
                  />
                  
                </div>
              </div>
            )
        }
    </div>
  )
}

export default ComicProfile;