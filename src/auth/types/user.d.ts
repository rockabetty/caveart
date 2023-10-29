export interface User {
    id: string;
    name: string;
}

export type UserAuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: null | string;
};

export enum ActionType {
    Login = "LOGIN",
    Logout = "LOGOUT",
    Verify = "VERIFY",
    Error = "ERROR",
    Loading = "LOADING",
    ViewProfile = "VIEW_PROFILE",
    UpdateProfile = "UPDATE_PROFILE"
}

export type UserProfile = {
    username?: string;
    email?: string;
    role?: 'Member' | 'Creator' | 'Moderator';
};

export type UserAction =
    | { type: ActionType.Login; payload: User }
    | { type: ActionType.Logout }
    | { type: ActionType.Verify; payload: Partial<UserAuthState> }
    | { type: ActionType.Error; payload: string }
    | { type: ActionType.Loading }
    | { type: ActionType.ViewProfile; payload: User }
    | { type: ActionType.UpdateProfile; payload: Partial<User> };