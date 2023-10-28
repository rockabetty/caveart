import UserContext from '../UserContext';
import {useContext} from 'react';

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }

    const [state, dispatch, loginUser, logoutUser, viewProfile] = context;

    const isAuthenticated = () => state.authenticated;
    const getUser = () => state.user;

    return {
        ...state,
        loginUser,
        logoutUser,
        viewProfile,
        getUser,
        isAuthenticated,
    };
};