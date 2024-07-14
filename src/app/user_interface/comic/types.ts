export type Genre = {
  id: string;
  name: string;
  description?: string;
};


export type GenreUserSelection = {
  [key: `${number}` | number]: Genre;
};

export type ContentWarningUserSelection = {
  [contentWarningName: string]: string | number;
};

export type ComicData = {
  id: string;
  genres: GenreUserSelection;
  description: string;
  title: string;
  subdomain: string;
  thumbnail: string;
  rating: string;
}

export type ComicField = keyof ComicData;

export type ComicPermissions = {
  edit: boolean
}

export type ComicTextInputField = Extract<keyof ComicData, 'title' | 'description' | 'subdomain'>;
