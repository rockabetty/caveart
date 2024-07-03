export type Comic = {
    id: number;
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

export type ComicColumnNames = keyof Comic;
export type ComicColumnsArray = ComicColumnNames[];

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