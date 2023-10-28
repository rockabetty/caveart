import { createContext, Dispatch } from "react";
import {UserAuthenticationState, UserAction} from "./types/UserTypes";

type UserContextType = [
  UserAuthenticationState,
  Dispatch<UserAction>,
  (email: string, password: string) => Promise<void>, // loginUser type
  () => Promise<void>  // logoutUser type
];

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;