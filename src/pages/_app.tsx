import Head from 'next/head'
import CaveartLayout from '../app/user_interface/CaveartLayout'
import LogIn from '../app/user_interface/authentication/LogIn'
import UserProvider from '../auth/client/UserProvider';
import { requireEnvVar } from '../errors/envcheck';

export default function CaveArt() {
  return (
    <>
      <Head>
        <title>Caveart Webcomic Hosting</title>
        <meta name="description" content="Caveart is a free host for your webcomic projects. Host, manage, and customize your own webcomic pages." />
        <meta name="keywords" content="webcomic hosting,webcomic host,webcomic hosts,free webcomic hosts,free webcomic host,free webcomic hosting,comic hosting,free comic hosting,webcomics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <CaveartLayout>
          <main>
            henlo welcome 2 chilis
          </main>
        </CaveartLayout>
      </UserProvider>
    </>
  )
}



// pages/_app.tsx or any specific page
export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  const tokenName = requireEnvVar('USER_AUTH_TOKEN_NAME'); // Assume this is your token's name

  const loggedIn = !!cookies && cookies.includes(tokenName);

  return {
    props: {
      loggedIn
    }
  }
}