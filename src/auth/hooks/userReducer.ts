import {UserAuthenticationState, UserAction} from "../types/UserTypes";

const userReducer = (state: UserAuthState, action: UserAction): UserAuthState => {
    switch (action.type) {
      case ActionType.LoginSuccess:
        return { ...state, user: action.payload, authenticated: true, loading: false }
      case ActionType.Logout:
        return { ...state, user: null, authenticated: false, loading: false }  
      case ActionType.ViewProfile:
        return { ...state, user: action.payload, loading: false};
      case ActionType.UpdateProfile: {
        if (state.user) {
          return {
            ...state,
            user: {
              ...state.user,
              ...action.payload
            },
            loading: false,
          };
        }
        return state;
      }
      case ActionType.Loading:
        return {...state, loading: true};
      case ActionType.Error:
        return {...state, error: action.payload, loading: false};
      default:
        return state;
    }
}

export default userReducer;