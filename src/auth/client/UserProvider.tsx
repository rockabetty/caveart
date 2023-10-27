import {ReactNode, useReducer, useEffect, useMemo, Dispatch} from "react";
import {User, UserAuthenticationState, UserAction, ActionType} from "./types/UserTypes";
import { logger } from "../logger"
import UserContext from "./UserContext";
import userReducer from "./hooks/userReducer";
import {dev, logActions, loggerMap} from './hooks/userLogger';

interface UserProviderProps {
    children: ReactNode;
}

const initialState: UserAuthenticationState = {
    user: null,
    authenticated: false,
    loading: false,
    error: null
}

const UserProvider = function({children}: UserProviderProps) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const loggedDispatch = (action: UserAction) => {
        const logFunction = logActions[action.type]
        if (logFunction & "payload" in action) {
            logFunction(action.payload)
        } else if (dev) {
           logger.warn(`Unknown action type: ${action.type}`);
        }
        dispatch(action);
    }

    const contextValue = useMemo(
        () => [state, dispatch] as [UserAuthenticationState, Dispatch<UserAction],
        [state, dispatch]
    );

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};

export default UserProvider;