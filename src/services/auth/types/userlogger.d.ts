import {User, ActionType, UserAuthState} from './user.d.ts';

export type LoginLoggerPayload = {
    user: {
      id: string;
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
    timestamp?: string;
};
