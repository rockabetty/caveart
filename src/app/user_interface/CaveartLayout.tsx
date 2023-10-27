import React, {useState, useEffect} from 'react';
import SiteHeader from './navigation/SiteHeader';

export default function CaveartLayout({ children }) {

  const loggedIn = false;
  const logOut = () => {};

  return (
  <>
    <SiteHeader
      onSignup={() => {openAuth('Sign Up')}}
      onLogIn={()=> {openAuth('Log In')}}
      loggedIn={loggedIn}
      onLogout={logOut}
    />

    <main>{children}</main>
  </>
  )
}

