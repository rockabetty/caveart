import {User, ActionType, UserAuthState} from './user';

export type LoginLoggerPayload = {
    user: User;
    source?: string;
};

export type LogoutLoggerPayload = {
    user: User;
    reason?: string
};

export type ViewProfileLoggerPayload = {
    user: User;
    loading: boolean;
};

export type UpdateProfileLoggerPayload = {
    user: Partial<User>;
    changes: Partial<User>;
    loading: boolean;
};

export type ErrorLoggerPayload = {
    error: Error;
};

export type VerifyLoggerPayload = {
    auth: Partial<UserAuthState>;
}

export type LoadingLoggerPayload = {
    process: ActionType;
};
