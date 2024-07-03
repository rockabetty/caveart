import react, { useEffect, useState} from 'react';
import axios from 'axios';
import GenreModel from '../../data/types/models';
import { Checkbox } from '../../../../component_library';
import '../layout.css';

type GenreSelectorProps = {
  id: string;
  selection: {[key:string]: number };
  onChange: (...params: any) => any;
  options: GenreModel[];
};

const GenreSelector: React.FC<GenreSelectorProps> = (props) => {

  const {id, onChange, selection, options} = props;
  
  return (
    <div className="ReactiveGrid">
      {options && options.map((genre, idx) =>
        <Checkbox
          key={`genre-${id}-${idx}`}
          id={`${id}-option-${genre.id}`} 
          labelText={genre.name}
          checked={selection && !!selection[genre.id as string | number]}
          onChange={onChange}
          name="genres"
          value={genre.id.toString()}
      />)}
    </div>
  )
}

export default GenreSelector;