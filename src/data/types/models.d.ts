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