const contractDeploymentTx = "0xc54f8658656d270313c50444a56439ccafc15055b0980393840ce4abe5a99d71";
const contractAddress = "0x0f0D919F45edFAf7A0De0B9707D5AC9c43527299";

const chainExplorerBaseAddress = "https://mumbai.polygonscan.com";
const contractDeploymentTxLink = `${chainExplorerBaseAddress}/tx/${contractDeploymentTx}`; 

module.exports = {
  contractAddress,
  contractDeploymentTx,
  chainExplorerBaseAddress,
  contractDeploymentTxLink,
}