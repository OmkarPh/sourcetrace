import Contract, { linkFromTxHash } from "./SourceTraceContract";

export function CallerFn(method: string, debug: boolean, ...params: any[]){
  return new Promise((resolve, reject) => {
    Contract.methods[method](...params)
      .call()
      .then((res: any) => {
        if(debug){
          console.log(`Called ${method} with params`, params, `\nResult:`, res);
        }
        resolve(res);
      }).catch((err: any) => {
          console.log(`Some error calling ${method} with params \n`, params, err);
          reject(new Error(`Couldn't fetch results for ${method}`));
      });
  });
}

export function SenderFn(method: string, senderAddress: string, debug: boolean, ...params: any[]){
  return new Promise((resolve, reject) => {
    const tx = Contract.methods.addPost(...params);
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
      console.log(`Some error sending ${method} with params \n`, params, err);
      reject(new Error(`Couldn't send tx for ${method}`));
    });
  });
}

export function CallerFactory(method: string, debug: boolean){
  return (...params: any[]) => CallerFn(method, debug, ...params);
}
export function SenderFactory(method: string, debug: boolean){
  return (address: string, ...params: any[]) => SenderFn(method, address, debug, ...params)
}