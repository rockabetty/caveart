import { AppProps } from 'next/app';
import UserProvider from '../services/auth/client/UserProvider';

export default function App({ Component, pageProps} : AppProps ) {
  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}
