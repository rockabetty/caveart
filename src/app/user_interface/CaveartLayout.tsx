import React, {useState, useEffect} from 'react';
import SiteHeader from './navigation/SiteHeader';
import  './../../../component_library/design/style.css'

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
    <div className="wrapper--text">
      <main>{children}</main>
    </div>
  </>
  )
}

