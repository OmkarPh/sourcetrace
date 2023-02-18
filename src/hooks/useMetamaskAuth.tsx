import { resolve } from "path";
import React, { useCallback, useEffect, useState } from "react";
import { MetamaskStateProvider, useMetamask } from "use-metamask";
import Web3 from "web3";

interface MetamaskOgValues {
  // connect?: (Web3Interface: any, settings?: {}) => Promise<void>;
  getAccounts?: (options?: {
    requestPermission: boolean
  }) => Promise<any>;
  getChain?: () => Promise<{
      id: string;
      name: string;
  }>;
  metaState: {
      isAvailable: boolean;
      account: any[];
      chain: {
          id: any;
          name: string;
      };
      isConnected: boolean;
      web3: any;
  };
};

interface CustomContextValues {
  isLoggedIn: boolean,
  isProcessingLogin: boolean,
  profile: null | {
    address: string,
    name: string,
    license: string,
    role: string,
  },
}
interface AdditionalContextValues {
  refreshAuthStatus: () => void,
  connect: () => void,
}
const MetaMaskAuthContext = React.createContext<MetamaskOgValues & CustomContextValues & AdditionalContextValues>({
  metaState: {
      isAvailable: false,
      account: [],
      chain: { id: null, name: "" },
      isConnected: false,
      web3: null,
  },
  connect: () => new Promise(() => resolve()),
  getAccounts: () => new Promise(() => resolve()),
  getChain: () => new Promise(() => resolve()),
  isLoggedIn: false,
  isProcessingLogin: false,
  profile: null,
  refreshAuthStatus: () => {},
});

function getLibrary(provider?: any, connector?: any) {
  return new Web3(provider)
}




// Provide these explicitly
export interface MetamaskAuthProviderProps {
  hasAccount: (address: string) => Promise<{ loggedIn: boolean, profile?: any }>,
  onConnected: () => void,
}

const MetamaskAuthProviderUtil = (props: React.PropsWithChildren<MetamaskAuthProviderProps>) => {
  const { hasAccount, onConnected } = props;
  const defaultMetamaskValues = useMetamask();
  const { metaState, getAccounts } = defaultMetamaskValues;
  const [authState, setAuthState] = useState<CustomContextValues>({
    isLoggedIn: false,
    isProcessingLogin: false,
    profile: null,
  });

  console.log("metamask state changed", defaultMetamaskValues);


  const refreshAuthStatus = async () => {
    if(!getAccounts)
      return;
    
    const accounts: string[] = await getAccounts({ requestPermission: false });
    if(!accounts?.length)
      return;

    setAuthState(prev => ({ ...prev, isProcessingLogin: true }));
    hasAccount(accounts[0])
      .then(user => {
        if(!user.loggedIn || !user.profile){
          setAuthState(prev => ({ isLoggedIn: false, profile: null, isProcessingLogin: false }));
          onConnected();
          return;
        }
        setAuthState({
          isLoggedIn: true,
          isProcessingLogin: false,
          profile: user.profile,
        })
      });
  }

  useEffect(() => {
    refreshAuthStatus();
  }, []);
  
  const connect = () => {
    if(!getAccounts)
      return;
    getAccounts()
      .then(accounts => {
        if(accounts.length){
          console.log("Already Connected to ", accounts);
          refreshAuthStatus();
          return;
        }

        if(typeof window !== 'undefined' && window.ethereum){
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => getAccounts())
            .then(async accounts => {
              console.log("Connected to ", accounts);
              refreshAuthStatus();
            })
        }
      })
  }

  

  return (
    <MetaMaskAuthContext.Provider value={{...defaultMetamaskValues, ...authState, refreshAuthStatus, connect}}>
      { props.children }
    </MetaMaskAuthContext.Provider>
  )
}

export const MetamaskAuthProvider = (props: React.PropsWithChildren<MetamaskAuthProviderProps>) => {
  return (
    <MetamaskStateProvider>
      <MetamaskAuthProviderUtil {...props}>
        { props.children }
      </MetamaskAuthProviderUtil>
    </MetamaskStateProvider>
  )
}

export default function useMetamaskAuth() {
  const context = React.useContext(MetaMaskAuthContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}