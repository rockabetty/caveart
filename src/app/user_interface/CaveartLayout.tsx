import React, {useState, useEffect} from 'react';
import SiteHeader from './navigation/SiteHeader';
import AuthModal from './authentication/AuthModal';
import UserProvider from '../../auth/client/UserProvider';
import  './../../../component_library/design/style.css'
import '../../i18n';
import './brand.css'

export default function CaveartLayout({ children }) {

  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<'Sign Up' | 'Log In' | ''>('')


  const logOut = () => {};
  const closeModal = () => {
    setAuthModalOpen(false)
  };

  const openAuth = function () {
    setAuthModalOpen(true);
  }

  const logIn = () => {};
  
  return (
  <UserProvider>
    <SiteHeader
      onSignup={() => {openAuth()}}
      onLogIn={()=> {openAuth()}}
      initial={authMode}
      loggedIn={loggedIn}
      onLogout={logOut}
    />
    <AuthModal
      isOpen={authModalOpen}
      onClose={closeModal}
      onAuth={logIn}
      loggedIn={loggedIn}
      initial={authMode}
    />

    <div className="wrapper--text">
      <main>{children}</main>
    </div>
  </UserProvider>
  )
}

