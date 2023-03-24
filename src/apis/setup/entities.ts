import Web3 from "web3";
import customWeb3 from "./customWeb3"
import { hasWindow } from "../../utils/general";
import SourceTraceABI from '../../contracts/SourceTraceABI.json';
import {
    contractAddress,
    // contractDeploymentTx,
    // contractDeploymentTxLink,
    chainExplorerBaseAddress
} from '../../contracts/deploymentDetails'

const linkFromTxHash = (txHash: string) => `${chainExplorerBaseAddress}/tx/` + txHash;

interface AccountKeys {
  pk: string,
  address: string,
  name: string,
}
interface ProducerDetails extends AccountKeys {
  physicalAddress: string,
}
interface WarehouseDetails extends AccountKeys {
  physicalAddress: string,
  certifications: { title: string, url: string }[],

}
export const producerAccounts: {[key: string]: ProducerDetails} = {
  nestle: {
    pk: '0fd9949357465ea9dc776d416fafe782772ef27baad8abdb4e5e64323b0618cc',
    address: '0xabd8EeD5b630578F72eEB06c637dB7179576A811',
    name: "Nestle India Ltd.",
    physicalAddress: "ICC Chambers, Marol, Andheri East, Mumbai, Maharashtra 400072",
  },
  wibs: {
    pk: '47bdfd22594b27d21f279ce22d0b9d673ceae68960ac358892a3381ded8e70e7',
    address: '0xCCCA8B3c76a6bE3CB933109855f4956E5F6Dd776',
    name: "Western India Bakers Pvt. Ltd.",
    physicalAddress: "Western India Bakers Pvt. Ltd A.P.M., Mafco Market Yard, Turbhe, Navi Mumbai-400703."
  },
}
export const warehouseAccounts: {[key: string]: WarehouseDetails} = {
  antophyll: {
    pk: "50df0b6a495e75aaa31f04f27bffdc380772b483d41a4826b7c854f434e086dd",
    address: "0x1FCC6B2778417cf0eD82f6e45f2be015f0742ECa",
    name: "Antophyll warehousing complex ltd.",
    physicalAddress: "Dosti Acres, Antop Hill, Wadala west, Mumbai, Maharashtra 400037",
    certifications: [],
  },
  eskimo: {
    pk: "f506511bdee935fd4e030c423edc51905b0f2b3956bb7be07ab3f7c05df1a65c",
    address: "0xD766DF5CcD4F7C73e0d2dc4d9f9a32616fdD7400",
    name: "Eskimo cold distribution",
    physicalAddress: "Bindal Industrial Estate, Sakinaka Tel. Exchange Lane, Andheri E, Maharashtra 400072",
    certifications: [
      {
        title: "Pollution control board certificate",
        url: "https://img.yumpu.com/17979570/1/500x640/part-2-maharashtra-pollution-control-board.jpg",
      },
    ],
  },
  welspun: {
    pk: "1d009ea92c976fd7db91281fc00f194e108daf4673f4be1d52389cfa2e6ae9d5",
    address: "0xB72bcAA4ecCD4fED4CB92f890be6d1ed0eC6cc08",
    name: "Welspun One logistics solution.",
    physicalAddress: "Kamala Mills Compound, Welspun House, Lower Parel, Mumbai, Maharashtra 400013",
    certifications: [],
  },
}


customWeb3.eth.accounts.wallet.clear();
Object.entries(producerAccounts).forEach(([_, producer]) => {
  customWeb3.eth.accounts.wallet.add(customWeb3.eth.accounts.privateKeyToAccount(producer.pk));
});
Object.entries(warehouseAccounts).forEach(([_, warehouse]) => {
  customWeb3.eth.accounts.wallet.add(customWeb3.eth.accounts.privateKeyToAccount(warehouse.pk));
});


console.log("All Accounts:", customWeb3.eth.accounts.wallet);
for(let i=0; i<customWeb3.eth.accounts.wallet.length; i++){
  const account = customWeb3.eth.accounts.wallet[i];
  customWeb3.eth.getBalance(account.address)
  .then(balance => console.log(`${i}. ${account.address} -> `, balance, Number(Web3.utils.fromWei(balance)).toPrecision(4), "eth" ));
}


function CallerFn(Contract: any, method: string, debug: boolean, ...params: any[]){
  return new Promise((resolve, reject) => {
    Contract.methods[method](...params)
      .call()
      .then((res: any) => {
        if(debug){
          console.log(`Called ${method} with params`, params, `\nResult:`, res);
        }
        resolve(res);
      }).catch((err: any) => {
        if(debug){
          console.log(`Some error calling ${method} with params \n`, params, err);
        }
        reject(new Error(`Couldn't fetch results for ${method}`));
      });
  });
}

function SenderFn(Contract: any, method: string, senderAddress: string, debug: boolean, ...params: any[]){
  return new Promise(async (resolve, reject) => {
    let gasprice = Number(await customWeb3.eth.getGasPrice());
    gasprice = Math.round(gasprice * 1.2);// to speed up 1.2 times..
 
    const tx = Contract.methods[method](...params);
    var gas_estimate = await tx.estimateGas({ from: senderAddress });
    gas_estimate = Math.round(gas_estimate * 1.2); 

    if(debug){
      console.log("Prepared transaction: ", tx);
    }
    
    tx
    .send({
      from: senderAddress,
      gas: customWeb3.utils.toHex(gas_estimate), 
      gasPrice:  customWeb3.utils.toHex(gasprice),
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

function CallerFactory(Contract: any, method: string, debug: boolean){
  return (...params: any[]) => CallerFn(Contract, method, debug, ...params);
}
function SenderFactory(Contract: any, method: string, debug: boolean){
  return (address: string, ...params: any[]) => SenderFn(Contract, method, address, debug, ...params)
}

const SourceTraceContract = new customWeb3.eth.Contract(SourceTraceABI as any, contractAddress);
const GetProducer = CallerFactory(SourceTraceContract, 'getProducer', false);
const GetWarehouse = CallerFactory(SourceTraceContract, 'getWarehouse', false);
const CreateProducerFn = SenderFactory(SourceTraceContract, 'createProducer', true);
const CreateWarehouseFn = SenderFactory(SourceTraceContract, 'createWarehouse', true);


function createProducers(){
  console.log("Creating producers ....");

  const promises: Promise<any>[] = [];
  Object.entries(producerAccounts).forEach(([key, producer], idx) => {
    const promise = new Promise((resolve, reject) => {
      GetProducer(producer.address)
        .then(response => {
          console.log(`${idx}. ${key} Producer already registered: `, response);
          reject(response);
        })
        .catch(err => {{
          console.log(`${idx}. ${key} Producer not registered, Creating ... `, producer.address);
          CreateProducerFn(producer.address, producer.name, producer.physicalAddress)
            .then(receipt => {
              console.log(`${idx}. Created producer ${key} with receipt: `, receipt);
              return resolve(receipt);
            });
        }})
    })
    promises.push(promise);
  });

  Promise.all(promises).then(function(results){
    console.log("Created producers with result:", results);
    console.log("Verify: ");
    Object.entries(producerAccounts).forEach(([key, producer], idx) => {
      new Promise((resolve, reject) => {
        GetProducer(producer.address)
          .then(response => {
            console.log(`${idx}. ${key} Producer already registered: `, response);
            resolve(response);
          })
          .catch(err => {{
            reject("Not registered");
          }})
      })
    });
  });
}
function createWarehouses(){
  console.log("Creating warehouses ....");

  const promises: Promise<any>[] = [];
  Object.entries(warehouseAccounts).forEach(([key, warehouse], idx) => {
    const promise = new Promise((resolve, reject) => {
      GetWarehouse(warehouse.address)
        .then(response => {
          console.log(`${idx}. ${key} Warehouse already registered: `, response);
          reject(response);
        })
        .catch(err => {{
          console.log(`${idx}. ${key} Warehouse not registered, Creating ... `, warehouse.address);
          CreateWarehouseFn(warehouse.address, warehouse.name, warehouse.physicalAddress)
            .then(receipt => {
              console.log(`${idx}. Created Warehouse ${key} with receipt: `, receipt);
              return resolve(receipt);
            });
        }})
    })
    promises.push(promise);
  });

  Promise.all(promises).then(function(results){
    console.log("Created warehouses with result:", results);
    console.log("Verify: ");
    Object.entries(warehouseAccounts).forEach(([key, warehouse], idx) => {
      new Promise((resolve, reject) => {
        GetWarehouse(warehouse.address)
          .then(response => {
            console.log(`${idx}. ${key} Warehouse already registered: `, response);
            resolve(response);
          })
          .catch(err => {{
            reject("Not registered");
          }})
      })
    });
  });
}

export const SETUP_TOOL = {
  SourceTraceContract,
  createProducers,
  createWarehouses,
}
if(hasWindow()){
  window.SETUP_TOOL = SETUP_TOOL;
}