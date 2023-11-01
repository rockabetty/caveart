export type UserModel = {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    password_reset_token?: string;
    password_reset_expiry?: Date;
    verified?: boolean;
    created_at?: Date;
    updated_at?: Date;
    role?: 'Member' | 'Creator' | 'Moderator';
};

export type ComicModel = {
    id?: number;
    title?: string;
    subdomain?: string;
    tagline?: string;
    description?: string;
    created_at?: Date;
    thumbnail?: string;
    comments?: number;
    critique?: boolean;
    is_unlisted?: boolean;
    is_private?: boolean;
    moderate_comments?: boolean;
    view_count?: number;
    likes?: boolean;
    like_count?: number;
    rating?: number;
    stylesheet_variables?: string;
};