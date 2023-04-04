const customWeb3 = require("./accounts");
const { contractAddress, chainExplorerBaseAddress } = require("./contract/deploymentDetails");
const SourceTraceABI = require("./contract/SourceTraceABI.json");

const linkFromTxHash = (txHash) => `${chainExplorerBaseAddress}/tx/` + txHash;

const SourceTraceContract = new customWeb3.eth.Contract(
  SourceTraceABI,
  contractAddress
);

function CallerFn(
  Contract,
  method,
  debug,
  ...params
) {
  return new Promise((resolve, reject) => {
    Contract.methods[method](...params)
      .call()
      .then((res) => {
        if (debug) {
          console.log(`Called ${method} with params`, params, `\nResult:`, res);
        }
        resolve(res);
      })
      .catch((err) => {
        if (debug) {
          console.log(
            `Some error calling ${method} with params \n`,
            params,
            err
          );
        }
        reject(new Error(`Couldn't fetch results for ${method}`));
      });
  });
}

function SenderFn(
  Contract,
  method,
  senderAddress,
  debug,
  ...params
) {
  return new Promise(async (resolve, reject) => {
    let gasprice = Number(await customWeb3.eth.getGasPrice());
    gasprice = Math.round(gasprice * 1.2); // to speed up 1.2 times..

    const tx = Contract.methods[method](...params);
    var gas_estimate = await tx.estimateGas({ from: senderAddress });
    gas_estimate = Math.round(gas_estimate * 1.2);

    if (debug) {
      console.log("Prepared transaction. ");
    }

    try {
      tx.send({
        from: senderAddress,
        gas: customWeb3.utils.toHex(gas_estimate),
        gasPrice: customWeb3.utils.toHex(gasprice),
      })
        .then((receipt) => {
          console.log(`${method} - Tx Receipt`, receipt);
          console.log(`Transaction hash: ${receipt?.transactionHash}`);
          console.log(
            `View the transaction here: `,
            linkFromTxHash(receipt?.transactionHash)
          );
          return resolve(receipt);
        })
        .catch((err) => {
          console.log(`Some error sending ${method} with params \n`, params, err);
          reject(new Error(`Couldn't send tx for ${method}`));
        });
      } catch(err) {
        console.log("Error in tx", err);
      }
    });
  }

function CallerFactory(Contract, method, debug) {
  return (...params) => CallerFn(Contract, method, debug, ...params);
}
function SenderFactory(Contract, method, debug) {
  return (address, ...params) =>
    SenderFn(Contract, method, address, debug, ...params);
}

const PollDetails = SenderFactory(SourceTraceContract, "poll", true);

module.exports ={
  PollDetails,
  CallerFactory,
  SenderFactory,
  CallerFn,
  SenderFn,
  linkFromTxHash,
}