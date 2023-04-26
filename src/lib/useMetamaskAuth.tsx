import React, {
  useEffect,
  useState,
} from "react";
import { MetamaskStateProvider, useMetamask } from "use-metamask";
import { generateAuthenticatedRoute } from "./AuthenticatedRoute";
import { generateConnectedRoute } from "./ConnectedRoute";


export interface RoutingConfig {
  // Dunno how to do this independent of the framework :()
  // navigateTo: (url: string, options: unknown) => void;

  onBoarding: string;    // Post-connection, if account doesn't exist
  loggedIn: string     // If account exists
  newComer: string      // Not connected yet
}

// Values provided by use-metamask
export interface MetamaskOgValues {
  getAccounts?: (options?: { requestPermission: boolean }) => Promise<any>;
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
}

export interface ContextValues {
  isLoggedIn: boolean;
  isProcessingLogin: boolean;
}

// Functions & standalone peoperties added to final context
export interface AdditionalContextValues {
  refreshAuthStatus: () => void;
  connect: () => void;
}

export type GenericContextValues = MetamaskOgValues & ContextValues & AdditionalContextValues
export interface MetamaskAuthProviderProps {
  hasAccount: (
    address: string
  ) => Promise<{ loggedIn: boolean; profile?: any | null }>;
  onConnected: () => void;
  onLoggedIn: () => void;
  onCancelledConnection: () => void;
}



export function createMetamaskAuth<CustomProfile>(routerInfo: RoutingConfig){
  interface CustomContextValues extends ContextValues {
    profile: CustomProfile | null;
  }

  const MetaMaskAuthContext = React.createContext<
    MetamaskOgValues & CustomContextValues & AdditionalContextValues
  >({
    metaState: {
      isAvailable: false,
      account: [],
      chain: { id: null, name: "" },
      isConnected: false,
      web3: null,
    },
    connect: () => new Promise((resolve) => resolve({})),
    getAccounts: () => new Promise((resolve) => resolve({})),
    getChain: () => new Promise((resolve) => resolve({
      id: '',
      name: '',
    })),
    isLoggedIn: false,
    isProcessingLogin: true,
    profile: null,
    refreshAuthStatus: () => {},
  });


  const MetamaskAuthProviderUtil = (
    props: React.PropsWithChildren<MetamaskAuthProviderProps>
  ) => {
    const { hasAccount, onConnected, onLoggedIn, onCancelledConnection } = props;
    const defaultMetamaskValues = useMetamask();
    const { metaState, getAccounts } = defaultMetamaskValues;
    const [authState, setAuthState] = useState<CustomContextValues>({
      isLoggedIn: false,
      isProcessingLogin: true,
      profile: null,
    });
  
    const refreshAuthStatus = async (redirect=false) => {
      if (!getAccounts) {
        setAuthState((prev) => ({ ...prev, isProcessingLogin: false }));
        return;
      }
  
      const accounts: string[] = await getAccounts({ requestPermission: false });
      if (!accounts?.length) {
        setAuthState((prev) => ({ ...prev, isProcessingLogin: false }));
        return;
      }
  
      if (!authState.isProcessingLogin)
        setAuthState((prev) => ({ ...prev, isProcessingLogin: true }));
  
      hasAccount(accounts[0]).then((user) => {
        if (!user.loggedIn || !user.profile) {
          setAuthState((prev) => ({
            isLoggedIn: false,
            profile: null,
            isProcessingLogin: false,
          }));
          if(redirect){
            onConnected();
          }
          return;
        }
  
        setAuthState({
          isLoggedIn: true,
          isProcessingLogin: false,
          profile: user.profile,
        });
        if(redirect){
          onLoggedIn();
        }
      });
    };
  
    useEffect(() => {
      refreshAuthStatus(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const connect = () => {
      if (!getAccounts) return;

      if(authState.isLoggedIn)
        return onLoggedIn();
  
      getAccounts().then((accounts) => {
        if(accounts && accounts.length) {
          console.log("Already Connected to ", accounts);
          refreshAuthStatus(true);
          onConnected();
          return;
        }
  
        getAccounts({ requestPermission: true })
          .then(async (accounts) => {
            console.log("Connected to ", accounts);
            refreshAuthStatus(true);
          })
          .catch(onCancelledConnection);
      });
    };
  
    return (
      <MetaMaskAuthContext.Provider
        value={{
          ...defaultMetamaskValues,
          ...authState,
          refreshAuthStatus,
          connect,
        }}
      >
        {props.children}
      </MetaMaskAuthContext.Provider>
    );
  }

  const MetamaskAuthProvider = (
    props: React.PropsWithChildren<MetamaskAuthProviderProps>
  ) => {
    return (
      <MetamaskStateProvider>
        <MetamaskAuthProviderUtil {...props}>
          {props.children}
        </MetamaskAuthProviderUtil>
      </MetamaskStateProvider>
    );
  };

  function useMetamaskAuth() {
    const context = React.useContext(MetaMaskAuthContext);
  
    if (context === undefined) {
      throw new Error(
        "useMetaMask hook must be used with a MetaMaskProvider component"
      );
    }
    return context;
  }

  const { AuthenticatedRoute, withAuthenticatedRoute } = generateAuthenticatedRoute(
    useMetamaskAuth,
    routerInfo
  );
  const { ConnectedRoute, withConnectedRoute } = generateConnectedRoute(
    useMetamaskAuth,
    routerInfo
  );

  return {
    AuthenticatedRoute, withAuthenticatedRoute,
    ConnectedRoute, withConnectedRoute,
    MetamaskAuthProvider, useMetamaskAuth,
  };
}