import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUser } from "./users/hooks/useUser";
import SiteHeader from "./navigation/SiteHeader";
import SiteFooter from "./navigation/SiteFooter";
import AuthModal from "./users/AuthModal";
import "@components/design/style.css";
import "../../i18n";
import "../themes/main.css";

interface CaveartLayoutProps {
  children: React.ReactNode;
  requireLogin?: boolean;
}

const CaveartLayout: React.FC<CaveartLayoutProps> = ({
  children,
  requireLogin = false,
}) => {
  const router = useRouter();
  const { isAuthenticated, verifyUser, logoutUser } = useUser();

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"Sign Up" | "Log In">("Sign Up");

  useEffect(() => {
    const authCheck = async () => {
      try {
        await verifyUser();
      } catch (error) {
        if (requireLogin) {
          console.log(error);
          router.push("/");
        }
      }
    };
   
    authCheck();

  }, [requireLogin, verifyUser, router]);

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openAuthModal = (whichMode: "Sign Up" | "Log In") => {
    setAuthMode(whichMode);
    setAuthModalOpen(true);
  };


  return (
    <>
      <Head>
        <title>Caveart Webcomic Hosting</title>
        <meta
          name="description"
          content="Caveart is a free host for your webcomic projects. Host, manage, and customize your own webcomic pages."
        />
        <meta
          name="keywords"
          content="webcomic hosting,webcomic host,webcomic hosts,free webcomic hosts,free webcomic host,free webcomic hosting,comic hosting,free comic hosting,webcomics"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SiteHeader
        onSignup={() => openAuthModal("Sign Up")}
        onLogIn={() => openAuthModal("Log In")}
        onLogout={logoutUser}
        loggedIn={isAuthenticated()}
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
  );
};

export default CaveartLayout;
