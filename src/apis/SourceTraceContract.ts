import Web3 from 'web3';
import SourceTraceABI from '../contracts/SourceTraceABI.json';
import {
    contractAddress,
    // contractDeploymentTx,
    // contractDeploymentTxLink,
    chainExplorerBaseAddress
} from '../contracts/deploymentDetails'
import { hasWindow } from '../utils/general';

if (hasWindow() && window.ethereum) {
    console.log('MetaMask is installed !', window.ethereum._metamask);
}

export const linkFromTxHash = (txHash: string) => `${chainExplorerBaseAddress}/tx/` + txHash;

export const web3 = new Web3(Web3.givenProvider);

const SourceTraceContract = new web3.eth.Contract(SourceTraceABI, contractAddress);

// console.log("Web3", web3);
// console.log("SourceTrace contract address: ", contractAddress);
// console.log("SourceTrace contract deployment: ", contractDeploymentTxLink);
// console.log("SourceTrace ABI: \n", SourceTraceABI);
// console.log("SourceTrace contract: \n", SourceTraceContract);

console.log("SourceTrace contract methods:", SourceTraceContract.methods);

if(hasWindow())
    window.SourceTraceContract = SourceTraceContract;

export default SourceTraceContract;