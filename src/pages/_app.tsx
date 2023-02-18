import type { AppProps } from 'next/app'
import Head from 'next/head';
import Navbar from '../components/core/Navbar';

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SourceTrace</title>
        <meta name="description" content="Decentralized Supply chain tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
