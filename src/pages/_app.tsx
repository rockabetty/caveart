import Head from 'next/head'
import CaveartLayout from '../app/user_interface/CaveartLayout'
import LogIn from '../app/user_interface/authentication/LogIn'
import UserProvider from '../auth/client/UserProvider';

export default function App({Component, pageProps}) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
