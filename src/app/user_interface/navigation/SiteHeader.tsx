import React from 'react'
import Cookies from "js-cookie";
import { Button, ButtonSet, Link } from '../../../../component_library'
import './Navigation.css'

const SiteHeader = ({
  onLogIn,
  onLogout,
  onSignup,
  loggedIn,
  ...props}: SiteHeaderProps) => {
  
  return (
    <div className="horizontal-nav">
      <div className="horizontal-nav_inner">
        <a href="/" className="horizontal-nav_brand">
          <img alt="Cave Art!" src='/img/brand/headerlogo.png' width='200' />
        </a>
        { loggedIn === true ? 
          <>
            <Link id="horizontal-nav_profile" href="/profile">My Account</Link>
            <Link id="horizontal-nav_manage-comics" href="/comics/mine">My Webcomics</Link>
            <Link id="horizontal-nav_reading-list" href="/read">My Reading List</Link>
          </>
          : ""
        }
        <div className="horizontal-nav_authentication">
          {
            loggedIn === true ?
              (
                <Button look="muted" id="header-logout" onClick={onLogout}>Log Out</Button>
              )
              :
              (
                <ButtonSet>
                  <Button id="header-signup" onClick={onSignup}>Sign Up</Button>
                  <Button id="header-login" onClick={onLogIn} look="primary">Log In</Button>
                </ButtonSet>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default SiteHeader
