import { GenreSelection } from '../../../data/types';
import { Checkbox } from '../../../../component_library';
import '../layout.css';

type GenreSelectorProps = {
  id: string;
  selection: {[key:string]: number };
  onChange: (...params: any) => any;
  options: GenreSelection;
};

export type GenreUserSelection = {
  [genreName: string]: boolean
}

const GenreSelector: React.FC<GenreSelectorProps> = (props) => {

  const {id, onChange, selection, options} = props;

   Object.values(options).map((value, idx) => {
    console.log(`value: ${value}, idx: ${idx}`);
   });

  return (
    <div className="ReactiveGrid">
      {options && Object.entries(options).map((key, value, idx) =>
        <Checkbox
          key={`genre-${id}-${idx}`}
          id={`${id}-option-${value.id}`} 
          labelText={value[key]}
          checked={selection && !!selection[value.id as string | number]}
          onChange={onChange}
          name="genres"
          value={value.id}
      />)}
    </div>
  )
}

export default GenreSelector;

/*

*/