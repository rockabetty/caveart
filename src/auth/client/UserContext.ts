import { createContext, Dispatch } from "react";
import {UserAuthenticationState, UserAction} from "./types/UserTypes";

const UserContext = createContext<[UserAuthenticationState, Dispatch<UserAction>] | null>(null);

export default UserContext;