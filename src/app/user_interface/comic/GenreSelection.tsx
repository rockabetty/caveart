import { Tag } from '../../../../component_library';
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
  genresSavedToComic: GenreUserSelection,
  allGenreChoices: string[]
  parentIsEditing: boolean;
}

const GenreSelection: React.FC<GenreSectionProps> = (props) => {

  const {
    allGenreChoices,
    parentIsEditing,
    genresSavedToComic
  } = props;

Object.values(allGenreChoices).map((value) => {
    console.log(value)
})

  return (
    <div>
      {Object.values(genresSavedToComic).map((value) => {
        return (
          <Tag label={value.name} />
        )
      })}
    </div>
  )
};

export default GenreSelection;

//   const {} = props;
  
//   return (
//     <div className="ReactiveGrid">
//       {options && options.map((genre, idx) =>
//         <Checkbox
//           key={`genre-${id}-${idx}`}
//           id={`${id}-option-${genre.id}`} 
//           labelText={genre.name}
//           checked={selection && !!selection[genre.id as string | number]}
//           onChange={onChange}
//           name="genres"
//           value={genre.id.toString()}
//       />)}
//     </div>
//   )
// }

// export default GenreSelector;