import Web3 from 'web3';
import { hasWindow } from '../../utils/general';

const providerURL = `https://rpc-mumbai.maticvigil.com/`;

const customWeb3 = new Web3(providerURL);

if(hasWindow())
  window.customWeb3 = customWeb3;

// console.log("CustomWeb3 config:", {
//   "Provider URL:": providerURL,
//   "Custom Web3: \n": customWeb3,
// });

export default customWeb3;