import { useState } from 'react';
import { Badge, Tag, Checkbox } from '../../../../component_library';
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
  parentIsEditing: boolean;
  onChange: (...params: any) => any;
}

const GenreSelection: React.FC<GenreSectionProps> = (props) => {

  const {
    id,
    allGenreChoices,
    parentIsEditing,
    comicProfileGenres,
    onChange
  } = props;

  return (
    <div>
      {Object.values(comicProfileGenres).map((value, idx) => {
        return (
          <Tag
            key={`browsing-genre${id ? `-${id}-` : '-'} ${idx}`}
            label={value.name}
          />
        )
      })}
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

      <Badge
        icon="edit"
        label="Edit"
      />
    </div>
  )
};

export default GenreSelection;

//   const {} = props;
  

// }

// export default GenreSelector;