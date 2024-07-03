export type User = {
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

export type UserColumnNames = keyof User;
export type UserColumnsArray = UserColumnNames[];

export type PasswordResetCredentials = Pick<UserModel, 
  'id' |
  'password_reset_token' |
  'password_reset_expiry'
>;

export type UserCredentials = Pick<UserModel,
  'id' |
  'username' |
  'email' |
  'password' |
  'verified' |
  'role'
>;

export type UserSession = {
    id: number;
    user_id: number;
    session_token: string;
    expiration_date: Date | null;
    created_at: Date;
};

export type CreatedUserResult = {
    id: number;
}
