import {ReactNode, useReducer, useEffect, useMemo, Dispatch} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {User, UserAuthState, UserAction, ActionType} from "../types/user.d.ts";
import UserContext from "./UserContext";
import userReducer from "./hooks/userReducer";
import {dev, logActions, loggerMap} from './hooks/userLogger';

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC = function({children}: UserProviderProps) {

    const initialState: UserAuthState = {
        user: null,
        authenticated: false,
        loading: false,
        error: null,
    }

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

    const verifyUser = async () => {
        dispatch({ type: ActionType.Loading });
        try {
            const response = await axios.post('/api/auth/check');
             dispatch({
                type: ActionType.Verify,
                payload: response.data
            });
            return response.data;
        }
        catch (error) {
          const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
          dispatch({ type: ActionType.Error, payload: errorMessage });
        }
    };

    const logoutUser = async () => {
        dispatch({ type: ActionType.Loading });
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
    };

    const viewProfile = async () => {
        dispatch({ type: ActionType.Loading });
        try {
            const response = await axios.post(`/api/auth/profile`);
            dispatch({
                type: ActionType.ViewProfile,
                payload: response.data
            });
            return response.data;
        }
        catch (error) {
          const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
          dispatch({ type: ActionType.Error, payload: errorMessage });
        }
    }

    const contextValue = useMemo(
        () => [state,
        dispatch,
        verifyUser,
        loginUser,
        logoutUser,
        viewProfile] as [
          UserAuthenticationState,
          Dispatch<UserAction>,
          typeof loginUser,
          typeof logoutUser,
          typeof viewProfile
        ],
        [state, dispatch]
    );

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};

export default UserProvider;