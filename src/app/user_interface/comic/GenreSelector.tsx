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
  allGenreChoices: GenreUserSelection,
  onChange: (...params: any) => any;
  onSave?: (...params: any) => any;
  editing?: boolean
}

const GenreSelector: React.FC<GenreSectionProps> = (props) => {

  const {
    id,
    allGenreChoices = [],
    comicProfileGenres,
    onChange,
    onSave,
    editing
  } = props;

  return (
      <div className="ReactiveGrid">
        {Object.values(allGenreChoices).map((genre, idx) =>
        <Checkbox
          key={`selectable-genre${id ? `-${id}-` : '-'}${idx}`}
          id={`${id ? `${id}-` : null }option-${genre.id}`} 
          labelText={genre.name}
          checked={comicProfileGenres && !!comicProfileGenres[Number(genre.id)]}
          onChange={onChange}
          name="genres"
          value={genre.id.toString()}
        />)}
      </div>
  );
  
};

export default GenreSelector;