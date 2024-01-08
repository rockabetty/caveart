import {User, ActionType, UserAuthState} from './user';

export type LoginLoggerPayload = {
    user: {
      id: string;
      name?: string;
    };
    source?: string;
};

export type LogoutLoggerPayload = {
    user: {
      id: string;
    }
    reason?: string
};

export type ViewProfileLoggerPayload = {
    user: User;
    loading: boolean;
};

export type UpdateProfileLoggerPayload = {
    user: User;
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
