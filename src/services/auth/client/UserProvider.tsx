/**
 * UserProvider Component
 *
 * This component serves as a context provider for user authentication. It provides
 * functions for logging in, logging out, verifying a user, and viewing a user profile.
 * It manages the user authentication state using the userReducer.
 * 
 * If you want to use these functions, you actually are in the wrong place.  This file
 * defines how these functions act under the hood and are subject to change!  You want
 * to go to 'useUser', which is a more 'stable' file that exposes these functions in a
 * more user-friendly manner.
 *
 * @component
 * @example
 * return (
 *   <UserProvider>
 *     <YourComponent />
 *   </UserProvider>
 * )
 */

import {ReactNode, useReducer, useMemo, Dispatch} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {User, UserAuthState, UserAction, ActionType, UserContextType} from "../types/user.d.ts";
import UserContext from "./UserContext";
import userReducer from "./hooks/userReducer";
import {dev, logActions, loggerMap} from './hooks/userLogger';

interface UserProviderProps {
    children: ReactNode;  /**< The React children components to be wrapped by the provider */
}

const UserProvider: React.FC = function({children}: UserProviderProps) {

    const initialState: UserAuthState = {
        user: null,
        authenticated: false,
        loading: false,
        error: null,
    }

    const [state, _dispatch] = useReducer(userReducer, initialState);
    const router = useRouter();

    /**
     * loggedDispatch dispatches actions with optional logging based on action type.
     * If the action type has a logFunction, the action payload will be logged.
     * If running in development mode and the action type is unknown, logs an error.
     * 
     * An 'action payload' is an object with data that corresponds to the action.
     * That payload comes from the database. For example, a payload for viewing a
     * user profile would be the profile data. 
     * 
     * @param {UserAction} action - The action to be dispatched and logged.
     */
    const dispatch = (action: UserAction) => {
        const logFunction = logActions[action.type]
        if (logFunction) {
            logFunction(action.payload)
        } else if (dev) {
           console.log(`Unknown action type: ${action.type}`);
        }
        _dispatch(action);
    }

    /**
     * loginUser will log in a user with provided email and password.
     * Dispatches loading state, sends API request, updates state accordingly,
     * and redirects to profile page on successful login.
     * 
     * To 'dispatch' is to basically send out an alert to code that is listening
     * for certain actions. Once they 'hear' that alert, that's their 'cue' to do
     * whatever they're coded to do.
     * 
     * So, there may be an interface that has a cute little loading graphic that
     * listens for the 'loading' state to dispatch before it shows the loading graphic.
     * 
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     */
    const loginUser = async (email: string, password: string) => {
        dispatch({ type: ActionType.Loading, payload: {process: ActionType.Login} });
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

    /**
     * verifyUser will ask the server to verify if this user is logged in.
     * When users log in, they're given authentication cookies (or tokens) 
     * that get tucked away into the request headers. While our browser 
     * doesn't readily show these specific headers, the server can read them.
     * This function is basically asking the server, "Hey, do you recognize
     * this user from their cookie?"
     * 
     * We especially want to use this function for features that should 
     * remain private to the user, like editing their own profile. It's 
     * a way to make sure the person requesting access is genuinely who 
     * they claim to be and not an imposter.
     */
    const verifyUser = async () => {
        dispatch({ type: ActionType.Loading, payload: {process: ActionType.Verify } });
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

    /**
     * logoutUser will log the user out by clearing the authentication cookies (or tokens).
     * The server deletes its record of the authentication info, which means that the next
     * time the user tries to access a protected resource, the server won't recognize them.
     * This ensures the user is not authenticated and would need to log in again.
     *
     * Meanwhile, the client's (web browser's) copy of the authentication info is deleted,
     * preventing it from making requests with old credentials.
     *
     */
    const logoutUser = async () => {
        dispatch({ type: ActionType.Loading, payload: {process: ActionType.Logout} });
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

    /**
     * viewProfile retrieves the user's profile data from the server and
     * returns it as an object. The function doesn't take any arguments 
     * because it relies on the server's knowledge of who is logged in. 
     * The server identifies the logged-in user through authentication 
     * tokens or cookies set during the login process. As such, there's no
     * need for us to specify which user's profile to fetch since the server
     * already knows.
     */
    const viewProfile = async () => {
        dispatch({ type: ActionType.Loading, payload: {process: ActionType.ViewProfile} });
        try {
            const response = await axios.get(`/api/auth/profile`);
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

    /**
     * useMemo is a hook (a certain type of function specific to React) which
     * 'memorizes' the result of a complicated function so it doesn't have to
     * re-compute that function every time it turns around.  Technically it's
     * 'memoizing', not 'memorizing', but for colloquial purposes, think of it 
     * as memorizing things.
     * 
     * Normally React's render function will fire off every single time the 
     * slightest thing changes.  Faster than your eyes can see, it will dump
     * the screen and re-calculate the screen and re-draw that screen, and
     * it doesn't matter if the change that results from it is imperceptible.
     * 
     * UseMemo takes a way more lax approach. It basically tells the browser,
     * "Wake me up when something actually interesting happens. If it isn't
     * interesting, I'm spitting out the same thing I gave you last time."
     *
     * What is 'interesting' to useMemo is the dependency array.
     * Here it's '[state, dispatch]', so that the big "UserContextType" array
     * doesn't get re-created every time some unrelated data changes
     * 
     * See 'UserContext' for what exactly is going on in the array passed
     * to this useMemo function call.
     */
    const contextValue = useMemo(
        () => [state,
        dispatch,
        verifyUser,
        loginUser,
        logoutUser,
        viewProfile] as UserContextType,
        [state, dispatch]
    );

    /**
     * UserContext.Provider is the provider component for the UserContext.
     * By wrapping parts of your component tree (your HTML elements) with this
     * provider, you make the contextValue available to any nested component, 
     * without having to pass props down manually at every level.
     *
     * UserContext.Provider takes the contextValue as its value property.
     * Any child component inside this provider can now use the React useContext 
     * hook to access the values and functions defined in contextValue.
     */
    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};

export default UserProvider;