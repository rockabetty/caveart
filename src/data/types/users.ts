import { UserModel } from './models';

export type UserColumnNames = keyof UserModel;
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
