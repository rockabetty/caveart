import { ImageUpload, Link, Button, Badge, TextArea, TextInput, ButtonSet } from '../../../../component_library'
import './ComicProfiles.css';
import GenreSelection, { GenreUserSelection } from './GenreSelection';
import { emptyProfile, ComicData, ComicTextInputField } from './ComicProfile';

type ComicProfileEditorProps = {
  comicId: string,
  profile: ComicData,
  onTextChange: (...params: any) => any,
  genres: GenreUserSelection,
  onUpdateGenre: (...params: any) => any,
  onFileChange: (...params: any) => any,
}

const ComicProfileEditor: React.FC<ComicProfileEditorProps> = (props: ComicProfileEditorProps) => {

  const {
    comicId,
    profile,
    onTextChange,
    genres,
    onUpdateGenre,
    onFileChange
  } = props;

  return (
    <div className="comic-profile_body">
      <ImageUpload
        labelText="Cover Image"
        helperText="Cover images can be up to 1MB."
        editable={true}
        maxSize={1000}
        src="/img/brand/kraugak.png"
        onChange={onFileChange}
      />
      <div className="comic-profile_descriptions">
        <h2>Basic Info</h2>
        <TextInput
          onChange={onTextChange}
          labelText="Title"
          id={`title-edit-${comicId}`}
          pattern="^[a-zA-Z0-9 !:_\-?]+$"
          placeholderText="Unga Bunga: The Grunga of UNGA"
          name="title"
          required
          value={profile?.title}
         />
         <TextInput
          onChange={onTextChange}
          labelText="Subdomain"
          helperText="A-Z, numbers, hyphens and undescores only.  Your comic will be hosted at http://yourChoice.caveartcomics.com"
          name="subdomain"
          pattern="[A-Za-z0-9\-_]{1,}"
          placeholderText="ungabunga"
          id={`subdomain-edit-${comicId}`}
          value={profile?.subdomain}
          required
         />
        <TextArea
          onChange={onTextChange}
          labelText="Description"
          name="description"
          placeholderText="Tell us about your comic!"
          id={`description-edit-${comicId}`}
          value={profile?.description}
        />
        <h2>Genres</h2>
        <GenreSelection
          comicProfileGenres={profile?.genres}
          allGenreChoices={genres}
          onChange={onUpdateGenre}
          id={profile.subdomain}
          parentIsEditing={true}
        />
      </div>
    </div>
  )
}

export default ComicProfileEditor;