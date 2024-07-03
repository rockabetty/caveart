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