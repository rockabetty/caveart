import React, {useState, useEffect} from 'react';
import { useRouter } from "next/router";
import Head from 'next/head'
import { Link } from '../../../component_library'
import { useUser } from "../../services/auth/client/hooks/useUser";
import SiteHeader from './navigation/SiteHeader';
import SiteFooter from './navigation/SiteFooter';
import AuthModal from './authentication/AuthModal';
import UserProvider from '../../services/auth/client/UserProvider';
import  './../../../component_library/design/style.css'
import '../../i18n';
import './themes/main.css'

export default function CaveartLayout({ children, requireLogin = false }) {

  const router = useRouter();
  const {isAuthenticated, verifyUser, hasSessionToken, isLoading, logoutUser} = useUser();

  const [loggedIn, setLoggedIn] = useState<boolean>(undefined)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<'Sign Up' | 'Log In'>('Sign Up');

  useEffect(() => {
    const authCheck = async () => {
      try {
        const {authenticated} = await verifyUser();
        setLoggedIn(authenticated);
      } catch (error) {
        if (requireLogin) {
          console.log(error)
          router.push("/");
        }
      }
    };
    authCheck();

    if (requireLogin && !isAuthenticated) {
      router.push("/");
    }
  }, []);

  const closeAuthModal = function () {
    setAuthModalOpen(false);
  }

  const openAuthModal = function (whichMode: string) {
    setAuthMode(whichMode);
    setAuthModalOpen(true);
  }

  return (
    <>
    <Head>
      <title>Caveart Webcomic Hosting</title>
      <meta name="description" content="Caveart is a free host for your webcomic projects. Host, manage, and customize your own webcomic pages." />
      <meta name="keywords" content="webcomic hosting,webcomic host,webcomic hosts,free webcomic hosts,free webcomic host,free webcomic hosting,comic hosting,free comic hosting,webcomics" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <SiteHeader
      onSignup={() => {openAuthModal('Sign Up')}}
      onLogIn={()=> {openAuthModal('Log In')}}
      onLogout={logoutUser}
      loggedIn={loggedIn}
    />
    <AuthModal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      initial={authMode}
    />

    <div className="wrapper--text">
      <main>{children}</main>
    </div>

    <SiteFooter />
    </>
  )
}

