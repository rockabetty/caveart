import { createContext, Dispatch } from "react";
import {UserAuthenticationState, UserAction, UserProfile} from "./types/UserTypes";

type UserContextType = [
  UserAuthenticationState,
  Dispatch<UserAction>,
  () => Promise<Partial<UserAuthenticationState>>,
  (email: string, password: string) => Promise<void>, // loginUser type
  () => Promise<void>, // logoutUser type
  () => Promise<UserProfile> // viewProfile type 
];

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;