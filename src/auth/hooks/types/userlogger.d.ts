import {User, ActionType} from './UserTypes';

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

export type LoadingLoggerPayload = {
    process: ActionType;
    timestamp?: string;
};
