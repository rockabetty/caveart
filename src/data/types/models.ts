export type UserModel = {
    id?: number;
    username?: string;
    email?: string;
    hashed_email?: string;
    password?: string;
    password_reset_token?: string | null;
    password_reset_expiry?: Date | null;
    verified?: boolean;
    created_at?: Date;
    updated_at?: Date;
    role?: 'Member' | 'Creator' | 'Moderator';
};

export type ComicModel = {
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
type ComicModelKeys = keyof ComicModel;
type CommaDelimitedKeys<T extends string> = `${T}` | `${T},${CommaDelimitedKeys<T>}`;
type ComicColumnList = CommaDelimitedKeys<Extract<keyof ComicModel, string>>;

export type GenreModel = {
    id: number;
    name: string;
    description?: string;
    path_name?: string;
};

export type ComicsGenreBridgeModel = {
    comic_id: number;
    genre_id: number;
    id?: number;
};

export type ContentWarningModel = {
    id?: number;
    name: string;
};

export type ComicsContentWarningBridgeModel = {
    comic_id: number;
    content_warning_id: number;
    id?: number;
};

export type ContentWarningModel = {
    id: number;
    name: string;
    children?: ContentWarningModel[]
}

export type ComicsUsersBridgeModel = {
    comic_id: number;
    user_id: number;
    role?: string;
};

export type ValidTableTypes = 
   | UserModel
   | ComicModel
   | GenreModel
   | ComicsGenreBridgeModel
   | ContentWarningModel
   | ComicsContentWarningBridgeModel
   | ComicsUsersBridgeModel