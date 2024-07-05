import React, { useState, useCallback } from 'react'
import GenreSelector, { GenreUserSelection } from './GenreSelector';
import { Genre } from '../../../data/types';
import { Tag } from '../../../../component_library';

type ComicGenresProps = {
  id: string;
  availableOptions: Genre[];
  initialSelection: GenreUserSelection;
  onChange: (...params: any) => any;
}

const ComicGenres: React.FC<ComicGenresProps> = (props) => {
  const {
    availableOptions,
    initialSelection,
    onChange
  } = props;

  const [newSelection, setNewSelection] = useState<GenreUserSelection>({});
  const [editing, setEditing] = useState<boolean>(false);

  const renderGenreSelector = useCallback(() => {
    return (
      <GenreSelector
        id={`genre-selector-${id}`}
        selection={newSelection}
        onChange={onChange}
        options={availableOptions}
      />
    )
  }, [newSelection]);

  const renderGenres = useCallback(() => {
    return (
      <div id={`genres-${id}`}>
        {initialSelection.map((label) => (
          <Tag
            key={`genre-${id}-${idx}`}
              id={`comic-${id}-genre-${idx}`}
              label={label}
            />
          ))
        }
      </div>
    )
  }, [newSelection]);

  return (
    <div>
      {editing
        ? renderGenreSelector()
        : renderGenres()
      }
    </div>
  );
}

export default ComicGenres;