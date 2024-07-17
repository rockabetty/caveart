import React from 'react'
import { Button, ButtonSet, Link } from '../../../../component_library'
import './Navigation.css'
import { useTranslation } from 'react-i18next';

type SiteHeaderProps = {
  onLogIn?: (...params: any) => any;
  onLogout?:  (...params: any) => any;
  onSignup?:  (...params: any) => any;
  loggedIn?: boolean;
}

const SiteHeader = ({
  onLogIn,
  onLogout,
  onSignup,
  loggedIn,
  }: SiteHeaderProps) => {

  const { t } = useTranslation();
  
  return (
    <div className="horizontal-nav">
      <div className="horizontal-nav_inner">
        <a href="/" className="horizontal-nav_brand">
          <img alt="Cave Art!" src='/img/brand/headerlogo.png' width='200' />
        </a>
        { loggedIn === true ? 
          <>
            <Link id="horizontal-nav_profile" href="/profile">{t('headerNavigation.myAccount')}</Link>
            <Link id="horizontal-nav_manage-comics" href="/comics/mine">{t('headerNavigation.myWebcomics')}</Link>
            <Link id="horizontal-nav_reading-list" href="/read">{t('headerNavigation.mySubscriptions')}</Link>
            <Link id="horizontal-nav_notifications" href="/notifications">{t('headerNavigation.notifications')}</Link>
          </>
          : ""
        }
        <div className="horizontal-nav_authentication">
          {
            loggedIn === true ?
              (
                <Button look="muted" id="header-logout" onClick={onLogout}>{t('authenticationForm.buttonLabels.logOut')}</Button>
              )
              :
              (
                <ButtonSet>
                  <Button id="header-signup" onClick={onSignup}>{t('authenticationForm.buttonLabels.signUp')}</Button>
                  <Button id="header-login" onClick={onLogIn} look="primary">{t('authenticationForm.buttonLabels.logIn')}</Button>
                </ButtonSet>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default SiteHeader
