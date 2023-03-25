import { linkFromTxHash } from "./SourceTraceContract";

export function CallerFn(Contract: any, method: string, debug: boolean, ...params: any[]){
  return new Promise((resolve, reject) => {
    Contract.methods[method](...params)
      .call()
      .then((res: any) => {
        if(debug){
          console.log(`Called ${method} with params`, params, `\nResult:`, res);
        }
        resolve(res);
      }).catch((err: any) => {
          if(debug)
            console.log(`Some error calling ${method} with params \n`, params, err);
          reject(new Error(`Couldn't fetch results for ${method}`));
      });
  });
}

export function SenderFn(Contract: any, method: string, senderAddress: string, debug: boolean, ...params: any[]){
  return new Promise(async (resolve, reject) => {
    const tx = Contract.methods[method](...params);
    if(debug){
      console.log("Prepared transaction: ", tx);
    }
    
    tx
    .send({
      from: senderAddress
    })
    .then((receipt: any) => {
      console.log(`${method} - Tx Receipt`, receipt);
      console.log(`Transaction hash: ${receipt?.transactionHash}`);
      console.log(
        `View the transaction here: `,
        linkFromTxHash(receipt?.transactionHash)
      );
      return resolve(receipt);
    })
    .catch((err: any) => {
      if(debug)
      console.log(`Some error sending ${method} with params \n`, params, err);
      reject(new Error(`Couldn't send tx for ${method}`));
    });
  });
}

export function CallerFactory(Contract: any, method: string, debug: boolean){
  return (...params: any[]) => CallerFn(Contract, method, debug, ...params);
}
export function SenderFactory(Contract: any, method: string, debug: boolean){
  return (address: string, ...params: any[]) => SenderFn(Contract, method, address, debug, ...params)
}