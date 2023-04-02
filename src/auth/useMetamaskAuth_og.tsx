import { resolve } from "path";
import React, {
  useEffect,
  useState,
} from "react";
import { MetamaskStateProvider, useMetamask } from "use-metamask";
import Web3 from "web3";
import { ParsedTruckDetails } from "./authConfig";

// Change here for customizations
export enum Roles {
  PRODUCER = "PRODUCER",
  WAREHOUSE = "WAREHOUSE",
}
export interface ProfileData {
  id: string;
  name: string;
  // license: string;
  role: Roles;
  location: string;
  parsedTruckDetails: ParsedTruckDetails[];
}


interface MetamaskOgValues {
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
interface CustomContextValues {
  isLoggedIn: boolean;
  isProcessingLogin: boolean;
  profile: ProfileData | null;
}
interface AdditionalContextValues {
  refreshAuthStatus: () => void;
  connect: () => void;
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
  connect: () => new Promise(() => resolve()),
  getAccounts: () => new Promise(() => resolve()),
  getChain: () => new Promise(() => resolve()),
  isLoggedIn: false,
  isProcessingLogin: true,
  profile: null,
  refreshAuthStatus: () => {},
});

// function getLibrary(provider?: any, connector?: any) {
//   return new Web3(provider);
// }

// Provide these explicitly
export interface MetamaskAuthProviderProps {
  hasAccount: (
    address: string
  ) => Promise<{ loggedIn: boolean; profile?: ProfileData }>;
  onConnected: () => void;
  onLoggedIn: () => void;
  onCancelledConnection: () => void;
}

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

    getAccounts().then((accounts) => {
      if (accounts.length) {
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
};

export const MetamaskAuthProvider = (
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

export default function useMetamaskAuth() {
  const context = React.useContext(MetaMaskAuthContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }
  return context;
}
