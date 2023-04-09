import type { AppProps } from "next/app";
import Head from "next/head";
import 'regenerator-runtime/runtime';
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

import {
  MetamaskAuthProviderProps
} from "../lib/useMetamaskAuth";
import { MetamaskAuthProvider, ProfileData, Roles } from "../auth/authConfig";
import Navbar from "../components/core/Navbar";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { GetProducer, GetWarehouse } from "../apis/apis";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/register.css';
import './styles/warehouse.css';
import './styles/component2.css';
import './styles/Content.css';
import './styles/Footer_style.css';
import './styles/mid_comp.css';

import { useEffect } from "react";
import { parseTruckData } from "../utils/general";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const use = async () => {
      (await import('tw-elements' as any)).default;
    };
    use();
  }, []);

  const TestProps: MetamaskAuthProviderProps = {
    hasAccount: (address: string) => {
      return new Promise((resolve, reject) => {
        console.log(`Checking if ${address} has an account ....`);

        setTimeout(() => {
          GetProducer(address)
          .then((response: any) => {
            const parsedProducer: ProfileData = {
              ...response,
              role: Roles.PRODUCER,
              parsedTruckDetails: parseTruckData(response.truckDetails, response.trucks),
            };
            console.log(`Logged in as producer `, parsedProducer);
            
            resolve({
              loggedIn: true,
              profile: parsedProducer,
            })
          })
          .catch(err => {
            console.log("Not registered as producer");

            GetWarehouse(address)
              .then((response: any) => {
                const parsedWarehouse: ProfileData = {
                  ...response,
                  role: Roles.WAREHOUSE,
                  parsedTruckDetails: parseTruckData(response.truckDetails, response.trucks),
                };
                console.log(`Logged in as warehouse `, parsedWarehouse);
                resolve({
                  loggedIn: true,
                  profile: parsedWarehouse
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
