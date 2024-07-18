import { Dispatch } from "react";
import * as loggerPayloads from "./userlogger";

export interface User {
    id: number;
    name: string;
    email: string;
}

export enum ActionType {
    Login = "LOGIN",
    Logout = "LOGOUT",
    Verify = "VERIFY",
    Error = "ERROR",
    Loading = "LOADING",
    ViewProfile = "VIEW_PROFILE",
    UpdateProfile = "UPDATE_PROFILE",
}

export type UserAuthState = {
    user: User | null;
    isAuthenticated?: boolean;
    isLoading: boolean;
    authError: loggerPayloads.ErrorLoggerPayload | null;
};

export type UserContextType = [
    UserAuthState,
    Dispatch<UserAction>,
    () => Promise<Partial<UserAuthState>>,
    (email: string, password: string) => Promise<void>,
    () => Promise<void>,
    () => Promise<UserProfile>,
];

export type UserProfile = {
    username: string;
    email: string;
    role: "Member" | "Creator" | "Moderator";
    created_at: string;
};

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
