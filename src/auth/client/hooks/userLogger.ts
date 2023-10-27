import logs from '../../logs';
import * as UserLoggerTypes from '../../types/userlogger';
import {ActionType} from "../../types/user.d.ts"

export const dev = process.env.NODE_ENV === 'development';

export const logActions = {
  LOGIN_SUCCESS: (payload: UserLoggerTypes.LoginLoggerPayload) => {
    logger.info(`${dev ? `User [ID: ${payload.id}] logged in from ${payload.source}` : 'User logged in'}`)
  },
  LOGOUT: (payload: UserLoggerTypes.LogoutLoggerPayload) => {
    // TODO: maybe log logout reason, e.g. session expiry or deliberate
    logger.info(`${dev ? `User [ID: ${payload.id}] logged out: ${payload.reason}` : 'User logged out'}`)
  },
  ERROR: (payload: UserLoggerTypes.ErrorLoggerPayload) => {
    const {error} = payload;
    if (dev) {
     logger.log(`Error occured: ${error.message} \n ${error.stack}`);
    }
    logger.log(`Error occurred: ${error.message}`);
  },
  LOADING: (payload: UserLoggerTypes.LoadingLoggerPayload) => {
    if (dev) {
      logger.info(`Loading started for ${payload.process} at ${new Date().toISOString()}`);
    }
  },
  VIEW_PROFILE: (payload: UserLoggerTypes.ViewProfileLoggerPayload) => {
    logger.log(`User profile view for user ${payload?.id || payload?.name}`)
  },
  UPDATE_PROFILE: (payload: UserLoggerTypes.UpdateProfileLoggerPayload) => {
    // TODO: maybe log the fields updated (not the actual values).
    logger.log(`User profile update for user ${payload?.id || payload?.name}`)
  }
};

type LoggerActionsMap = {
    [K in ActionType]?: (payload: any) => void;
};

export const loggerMap: LoggerActionsMap = {
    [ActionType.LoginSuccess]: logActions.LOGIN,
    [ActionType.Logout]: logActions.LOGOUT,
    [ActionType.ViewProfile]: logActions.VIEW_PROFILE,
    [ActionType.UpdateProfile]: logActions.UPDATE_PROFILE,
    [ActionType.Error]: logActions.ERROR,
    [ActionType.Loading]: logActions.LOADING
};