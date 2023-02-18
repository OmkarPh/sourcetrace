import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from "next/router";

import { MetamaskAuthProvider, MetamaskAuthProviderProps } from '../hooks/useMetamaskAuth';

import Navbar from '../components/core/Navbar';

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const { push } = useRouter();

  const TestProps: MetamaskAuthProviderProps = {
    hasAccount: (address: string) => {
      return new Promise((resolve, reject) => {
        console.log(`Checking if ${address} has an account ....`);

        setTimeout(() => resolve({
          loggedIn: false,
          profile: null
        }), 2000);

        // setTimeout(() => resolve({
        //   loggedIn: true,
        //   profile: {
        //     address,
        //     name: "Nestle",
        //     license: "SJIWE23",
        //     role: "Producer",
        //   }
        // }), 2000);
      });
    },
    onConnected: () => {
      // Redirect to signup / onboarding page here
      push('signup');
    }
  }
  
  return (
    <>
      <Head>
        <title>SourceTrace</title>
        <meta name="description" content="Decentralized Supply chain tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MetamaskAuthProvider {...TestProps}>
        <Navbar />
        <Component {...pageProps} />
      </MetamaskAuthProvider>
    </>
  );
}
