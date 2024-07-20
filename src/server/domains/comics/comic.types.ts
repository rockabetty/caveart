export type Comic = {
    id?: number;
    title?: string;
    subdomain?: string;
    tagline?: string;
    description?: string;
    created_at?: Date;
    thumbnail?: string;
    comments?: boolean;
    critique?: boolean;
    is_unlisted?: boolean;
    is_private?: boolean;
    moderate_comments?: boolean;
    view_count?: number;
    likes?: boolean;
    like_count?: number;
    rating?: string;
    stylesheet_variables?: string;
};

export type ComicColumnList = Array<keyof Comic>;

export type ComicContentWarning = {
    comic_id: number;
    content_warning_id: number;
    id?: number;
};

export type ComicAuthor = {
    comic_id: number;
    user_id: number;
    role?: string;
};

export type ComicGenre = {
    comic_id: number;
    genre_id: number;
    id?: number;
};

export type Genre = {
    id: number;
    name: string;
    description?: string;
    path_name?: string;
};

export type GenreSelection = {
    [id: string]: string
}

export type ContentWarning = {
    id?: number;
    name: string;
    description?: string;
    parent_id?: number;
};

export type NestedContentWarning = {
    id?: number;
    name: string;
    description?: string;
    parent_id?: number;
    children?: NestedContentWarning[]
};