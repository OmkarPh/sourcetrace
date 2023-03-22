import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    customWeb3: any,
    web3: any;
    SourceTraceContract: Contract;
  }
}