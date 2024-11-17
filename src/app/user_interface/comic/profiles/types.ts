export type Genre = {
  id: number | string;
  name: string;
  description?: string;
};

export type ContentWarning = {
  id: number;
  name: string;
  description?: string;
}

export type GenreUserSelection = {
  [key: number]: Genre;
};

export type ContentWarningUserSelection = {
  [contentWarningName: string]: ContentWarning;
};

export type ComicData = {
  id: string | number;
  genres: GenreUserSelection;
  content_warnings: ContentWarningUserSelection;
  description: string;
  title: string;
  subdomain: string;
  thumbnail?: string | File;
  rating: string;
  likes?: boolean;
  comments?: 'Allowed' | 'Moderated' | 'Disabled';
  visibility?: 'Public' | 'Unlisted' | 'Private';
}

export type ComicField = keyof ComicData;

export type ComicPermissions = {
  edit: boolean
}

export type ComicTextInputField = Extract<keyof ComicData, 'title' | 'description' | 'subdomain'>;
