import { Dispatch } from "react";
import * as loggerPayloads from "./userlogger";

export interface User {
    id: number;
    name: string;
    email: string;
}

export type UserAuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: loggerPayloads.AuthError | null;
};

export enum ActionType {
    Login = "LOGIN",
    Logout = "LOGOUT",
    Verify = "VERIFY",
    Error = "ERROR",
    Loading = "LOADING",
    ViewProfile = "VIEW_PROFILE",
    UpdateProfile = "UPDATE_PROFILE",
}

export type UserProfile = {
    username: string;
    email: string;
    role: "Member" | "Creator" | "Moderator";
    created_at: string;
};

// ToDo:
// type MemberProfile = UserProfile & { role: 'Member' }, etc.

/**
 * UserContextType defines the structure and types of our user context.
 * The numbered definitions below are in the same order as the entries
 * in 'type UserContextType' (e.g. the 2nd item is the Dispatch item).
 *
 * @type {Array}
 *  1. The user's authentication state of type UserAuthenticationState.
 *  2. Dispatch function for user actions of type Dispatch<UserAction>.
 *  3. Function returning a promise with a partial user authentication state.
 *  4. Function to handle user login with email and password which returns a promise.
 *  5. Function to handle user logout which returns a promise.
 *  6. Function to view a user profile, returning a promise with the user profile.
 */
export type UserContextType = [
    UserAuthState,
    Dispatch<UserAction>,
    () => Promise<Partial<UserAuthState>>,
    (email: string, password: string) => Promise<void>,
    () => Promise<void>,
    () => Promise<UserProfile>,
];

export type UserAction =
    | { type: ActionType.Login; payload: loggerPayloads.LoginLoggerPayload }
    | { type: ActionType.Logout; payload: loggerPayloads.LogoutLoggerPayload }
    | { type: ActionType.Verify; payload: loggerPayloads.VerifyLoggerPayload }
    | { type: ActionType.Error; payload: loggerPayloads.ErrorLoggerPayload }
    | { type: ActionType.Loading; payload: loggerPayloads.LoadingLoggerPayload }
    | {
          type: ActionType.ViewProfile;
          payload: loggerPayloads.ViewProfileLoggerPayload;
      }
    | {
          type: ActionType.UpdateProfile;
          payload: loggerPayloads.UpdateProfileLoggerPayload;
      };
