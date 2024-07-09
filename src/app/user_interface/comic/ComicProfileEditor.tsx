import { ImageUpload, Link, Button, Badge, TextArea, TextInput, ButtonSet } from '../../../../component_library'
import './comicProfile.css';
import GenreSelection, { GenreUserSelection } from './GenreSelection';
import { emptyProfile, ComicData, ComicTextInputField } from './ComicProfile';

type ComicProfileEditorProps = {
  comicId: string,
  profile: ComicData,
  onTextChange: (...params: any) => any,
  genres: GenreUserSelection,
  onUpdateGenre: (...params: any) => any,
}

const ComicProfileEditor: React.FC<ComicProfileEditorProps> = (props: ComicProfileEditorProps) => {

  const {
    comicId,
    profile,
    onTextChange,
    genres,
    onUpdateGenre
  } = props;

  return (
    <div className="comic-profile_editor">
      <TextInput
        onChange={onTextChange}
        labelText="Title"
        id={`title-edit-${comicId}`}
        name="title"
        value={profile?.title}
       />
       <TextInput
        onChange={onTextChange}
        labelText="Subdomain"
        name="subdomain"
        id={`subdomain-edit-${comicId}`}
        value={profile?.subdomain}
       />
      <TextArea
        onChange={onTextChange}
        labelText="Description"
        name="description"
        id={`description-edit-${comicId}`}
        value={profile?.description}
      />

      <GenreSelection
        comicProfileGenres={profile?.genres}
        allGenreChoices={genres}
        onChange={onUpdateGenre}
        id={profile.subdomain}
        parentIsEditing={true}
      />
    </div>
  )
}

export default ComicProfileEditor;