import {ReactNode, useReducer, useEffect, useMemo, Dispatch} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {User, UserAuthenticationState, UserAction, ActionType} from "../types/user.d.ts";
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
    const router = useRouter();

    const loggedDispatch = (action: UserAction) => {
        const logFunction = logActions[action.type]
        if (logFunction && "payload" in action) {
            logFunction(action.payload)
        } else if (dev) {
           console.log(`Unknown action type: ${action.type}`);
        }
        dispatch(action);
    }

    const loginUser = async (email: string, password: string) => {
        dispatch({ type: ActionType.Loading });
        try {
            const loginInfo = { email, password };
            const response = await axios.post('/api/auth/login', loginInfo);
            dispatch({
                type: ActionType.Login,
                payload: response.data.user
            });
            router.push(`/profile`);
        }
        catch(error) {
          const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
          dispatch({ type: ActionType.Error, payload: errorMessage });
        }
    };

    const logoutUser = async () => {
        dispatch({ type: ActionType.Logout });
        try {
            const response = await axios.post('/api/auth/logout');
            dispatch({
                type: ActionType.Logout,
                payload: response.data
            });
            router.push('/');
        }
        catch (error) {
          const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
          dispatch({ type: ActionType.Error, payload: errorMessage });
        }
    }

    const contextValue = useMemo(
        () => [state, dispatch, loginUser, logoutUser] as [UserAuthenticationState, Dispatch<UserAction>, typeof loginUser, typeof logoutUser],
        [state, dispatch]
    );

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};

export default UserProvider;