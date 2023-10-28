import React, {useState, useEffect} from 'react';
import { useRouter } from "next/router";
import { useUser } from "../../auth/client/hooks/useUser";
import SiteHeader from './navigation/SiteHeader';
import AuthModal from './authentication/AuthModal';
import UserProvider from '../../auth/client/UserProvider';
import  './../../../component_library/design/style.css'
import '../../i18n';
import './themes/main.css'

export default function CaveartLayout({ children, requireLogin = false }) {

  const router = useRouter();
  const {isAuthenticated} = useUser();

  useEffect(() => {
    if (requireLogin && !isAuthenticated()) {
      router.push("/");
    }
  }, []);

  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<'Sign Up' | 'Log In'>('Sign Up');

  const closeAuthModal = function () {
    setAuthModalOpen(false);
  }

  const openAuthModal = function (whichMode: string) {
    setAuthMode(whichMode);
    setAuthModalOpen(true);
  }

  const logOut = () => {};
  const logIn = () => {};
  
  return (
    <>
    <SiteHeader
      onSignup={() => {openAuthModal('Sign Up')}}
      onLogIn={()=> {openAuthModal('Log In')}}
      loggedIn={loggedIn}
      onLogout={logOut}
    />
    <AuthModal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      onAuth={logIn}
      initial={authMode}
    />

    <div className="wrapper--text">
      <main>{children}</main>
    </div>
    </>
  )
}

