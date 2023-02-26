import type { AppProps } from "next/app";
import Head from "next/head";
import 'regenerator-runtime/runtime';
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

import {
  MetamaskAuthProviderProps
} from "../lib/useMetamaskAuth";
import { MetamaskAuthProvider } from "../auth/authConfig";
import Navbar from "../components/core/Navbar";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // const {} = useToast();

  const TestProps: MetamaskAuthProviderProps = {
    hasAccount: (address: string) => {
      return new Promise((resolve, reject) => {
        console.log(`Checking if ${address} has an account ....`);

        setTimeout(() => {
          const response = localStorage.getItem(address);
          console.log(`Checking if ${address} has an account ....  => `, response);
          if (response && response === "yes")
            resolve({
              loggedIn: true,
              profile: {
                address,
                name: "Nestle",
                license: "SJIWE23",
                role: "Producer",
              },
            });
          else
            resolve({
              loggedIn: false,
              profile: null,
            });
        }, 2000);
      });
    },
    onConnected: () => {
      // Redirect to signup / onboarding page here
      router.push("signup");
    },
    onLoggedIn: () => {
      router.push("dashboard");
    },
    onCancelledConnection: () => {
      toast("Connection request cancelled !", { type: "error" });
    }
  };

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
      <ToastContainer />
    </>
  );
}
