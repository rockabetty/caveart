/**
 This module is used for setting up a React context that revolves around user authentication and profile management. 

 To learn more about what a React "context" is: https://react.dev/learn/scaling-up-with-reducer-and-context
 */

import { createContext, Dispatch } from "react";
import {UserAuthenticationState, UserAction, UserProfile} from "./types/UserTypes";

/**
 * UserContextType defines the structure and types of our user context.
 * The numbered definitions below are in the same order as the entries
 * in 'type UserContextType' (e.g. the 2nd item is the Dispatch item).
 * 
 * @type {Array}
 *  1. The user's authentication state of type UserAuthenticationState.
 *  2. Dispatch function for user actions of type Dispatch<UserAction>.
 *  3. Function returning a promise with a partial user authentication state.
 *  4. Function to handle user login with email and password which returns a promise.
 *  5. Function to handle user logout which returns a promise.
 *  6. Function to view a user profile, returning a promise with the user profile.
 */
type UserContextType = [
  UserAuthenticationState,
  Dispatch<UserAction>,
  () => Promise<Partial<UserAuthenticationState>>,
  (email: string, password: string) => Promise<void>,
  () => Promise<void>,
  () => Promise<UserProfile>
];

/**
 * UserContext is the main React context for user management and actions.
 * It gets used with React's useContext hook to access user-related functions.
 * @default {null}
 */
const UserContext = createContext<UserContextType | null>(null);

export default UserContext;