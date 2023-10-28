import {ReactNode, useReducer, useEffect, useMemo, Dispatch} from "react";
import {User, UserAuthenticationState, UserAction, ActionType} from "../types/user.d.ts";
import axios from "axios";
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
           console.log(`Unknown action type: ${action.type}`);
        }
        dispatch(action);
    }

    const loginUser = async (email: string, password: string) => {
        console.log("User provider!")
        dispatch({ type: ActionType.Loading });
        try {
            const loginInfo = { email, password };
            const loginAttempt = axios.post('/api/auth/login', loginInfo);
            dispatch({
                type: ActionType.Login,
                payload: response.data.user
            });
        }
        catch(error) {
          const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
          dispatch({ type: ActionType.Error, payload: errorMessage });
        }
    };

    const contextValue = useMemo(
        () => [state, dispatch, loginUser] as [UserAuthenticationState, Dispatch<UserAction>, typeof loginUser],
        [state, dispatch]
    );

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};

export default UserProvider;