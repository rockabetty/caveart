import { useState, useCallback } from 'react';
import { Badge, Button, Tag, Checkbox, ButtonSet } from '../../../../component_library';
import '../layout.css';

export type Genre = {
  id: string;
  name: string;
  description?: string;
}

export type GenreUserSelection = {
  [key: `${number}` | number]: Genre
}

type GenreSectionProps = {
  id: string;
  comicProfileGenres: GenreUserSelection,
  allGenreChoices: string[]
  parentIsEditing: boolean | undefined;
  onChange: (...params: any) => any;
  onSave: (...params: any) => any;
}

const GenreSelection: React.FC<GenreSectionProps> = (props) => {

  const {
    id,
    allGenreChoices,
    parentIsEditing,
    comicProfileGenres,
    onChange,
    onSave
  } = props;

  const [editing,setEditing] = useState<boolean>(false);
  
  const toggleEditing = () => {
    setEditing(!editing);
  }

  const cancelEdit = () => {
    setEditing(false);
  }

  const handleSave = async () => {
    try {
      // await onSave();
      setEditing(false);
    }
    catch (error: any) {
      console.error(error);
    }
  }

  const renderGenreSelector = useCallback(() => {
    return (
      <div>
        <div className="ReactiveGrid">
          {Object.values(allGenreChoices).map((genre, idx) =>
          <Checkbox
            key={`selectable-genre${id ? `-${id}-` : '-'}${idx}`}
            id={`${id ? `${id}-` : null }option-${genre.id}`} 
            labelText={genre.name}
            checked={comicProfileGenres && !!comicProfileGenres[genre.id as string | number]}
            onChange={onChange}
            name="genres"
            value={genre.id.toString()}
          />)}
      </div>
      {parentIsEditing === undefined
           ?(
            <div className="flexrow FlushRight">
              <ButtonSet classes="FlushRight">
                <Button inline={true} onClick={cancelEdit}>Cancel</Button>
                <Button inline={true} onClick={handleSave} look="primary">Save</Button>
              </ButtonSet>
            </div>
           )
           : null
       }
      </div>
    );
  }, [allGenreChoices, comicProfileGenres, onChange]);

  const renderComicProfileGenres = useCallback(() => {
    const selectedGenres = Object.values(comicProfileGenres);

    return (
      <div>
      {selectedGenres.length === 0
        ? <span>No genres.</span>
        : (<div>
          {selectedGenres.map((value, idx) => {
            return (
              <Tag
                key={`browsing-genre${id ? `-${id}-` : '-'} ${idx}`}
                label={value.name}
              />
            )
          })}
          </div>)
      }
      {parentIsEditing === undefined
        ?  <Badge icon={editing ? "close" : "edit"} label={editing ? "Cancel editing" : "Edit genres"} onClick={toggleEditing} />
        : null
      }
      </div>
    );
  }, [comicProfileGenres]);

  return (
    <div>
      { !parentIsEditing && editing
        ? renderGenreSelector()
        : renderComicProfileGenres()
      }
    </div>
  )
};

export default GenreSelection;