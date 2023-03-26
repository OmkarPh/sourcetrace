import type { AppProps } from "next/app";
import Head from "next/head";
import 'regenerator-runtime/runtime';
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

import {
  MetamaskAuthProviderProps
} from "../lib/useMetamaskAuth";
import { MetamaskAuthProvider, Roles } from "../auth/authConfig";
import Navbar from "../components/core/Navbar";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { GetProducer, GetWarehouse } from "../apis/apis";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/register.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const TestProps: MetamaskAuthProviderProps = {
    hasAccount: (address: string) => {
      return new Promise((resolve, reject) => {
        console.log(`Checking if ${address} has an account ....`);

        setTimeout(() => {
          GetProducer(address)
          .then((response: any) => {
            console.log(`Registered as producer `, response);
            console.log("Resolve obj:", {
              loggedIn: true,
              profile: {
                ...response,
                role: Roles.PRODUCER,
              },
            });
            
            resolve({
              loggedIn: true,
              profile: {
                ...response,
                role: Roles.PRODUCER,
              },
            })
          })
          .catch(err => {
            console.log("Not registered as producer");

            GetWarehouse(address)
              .then((response: any) => {
                console.log(`Registered as warehouse `, response);
                resolve({
                  loggedIn: true,
                  profile: {
                    ...response,
                    role: Roles.WAREHOUSE,
                  },
                })
              })
              .catch(err => {
                console.log("Not registered as warehouse");
                // reject("Not registered !");
                resolve({
                  loggedIn: false,
                  profile: null,
                });
              });
          })
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
