import Head from 'next/head'
import CaveartLayout from '../app/user_interface/CaveartLayout'

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
      <CaveartLayout>
        <main>
          henlo welcome 2 chilis
        </main>
      </CaveartLayout>
    </>
  )
}
