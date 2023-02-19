import { useRouter } from "next/router";
import { resolve } from "path";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Type } from "typescript";
import { MetamaskStateProvider, useMetamask } from "use-metamask";
import Web3 from "web3";

/**
 * Change here for customizations
 */
export enum Roles {
  PRODUCER = "PRODUCER",
  WAREHOUSE = "WAREHOUSE",
}
interface CustomContextValues {
  isLoggedIn: boolean;
  isProcessingLogin: boolean;
  // profile: CustomProfile | null;
  profile: null | {
    address: string;
    name: string;
    license: string;
    role: Roles;
  };
}
interface AdditionalContextValues {
  refreshAuthStatus: () => void;
  connect: () => void;
}

/**
 *
 */
interface MetamaskOgValues {
  // connect?: (Web3Interface: any, settings?: {}) => Promise<void>;
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

function getLibrary(provider?: any, connector?: any) {
  return new Web3(provider);
}

// Provide these explicitly
export interface MetamaskAuthProviderProps {
  hasAccount: (
    address: string
  ) => Promise<{ loggedIn: boolean; profile?: any }>;
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

  const refreshAuthStatus = async () => {
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
        onConnected();
        return;
      }

      setAuthState({
        isLoggedIn: true,
        isProcessingLogin: false,
        profile: user.profile,
      });
      onLoggedIn();
    });
  };

  useEffect(() => {
    refreshAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = () => {
    if (!getAccounts) return;

    getAccounts().then((accounts) => {
      if (accounts.length) {
        console.log("Already Connected to ", accounts);
        refreshAuthStatus();
        onConnected();
        return;
      }

      getAccounts({ requestPermission: true })
        .then(async (accounts) => {
          console.log("Connected to ", accounts);
          refreshAuthStatus();
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
