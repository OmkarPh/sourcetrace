import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

import {
  MetamaskAuthProvider,
  MetamaskAuthProviderProps,
} from "../auth/useMetamaskAuth";
import Navbar from "../components/core/Navbar";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const { push } = useRouter();
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
      push("signup");
    },
    onLoggedIn: () => {
      push("dashboard");
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
