import {User} from './users';
import {Comic, ComicGenre, ComicContentWarning, ComicAuthor} from './comics';
import {Genre} from './genres';
import {ContentWarning} from './contentwarnings';

export * from './contentwarnings';
export * from './comics';
export * from './genres';
export * from './users';
export * from './queries';
export * from './errors';


export type ValidTableTypes = 
   | User
   | Comic
   | Genre
   | ComicGenre
   | ContentWarning
   | ComicContentWarning
   | ComicAuthor