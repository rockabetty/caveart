import { AppProps } from 'next/app';
import UserProvider from '../app/user_interface/users/UserProvider';

export default function App({ Component, pageProps} : AppProps ) {
  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}
