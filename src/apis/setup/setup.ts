import Web3 from "web3";
import customWeb3 from "./customWeb3"
import { DEFAULT_PRODUCT_IMAGE, hasWindow, params, temperatureToUnits, weiToEth } from "../../utils/general";
import SourceTraceABI from '../../contracts/SourceTraceABI.json';
import {
    contractAddress,
    // contractDeploymentTx,
    // contractDeploymentTxLink,
    chainExplorerBaseAddress
} from '../../contracts/deploymentDetails'
import { producerAccounts, warehouseAccounts } from "./details";

const linkFromTxHash = (txHash: string) => `${chainExplorerBaseAddress}/tx/` + txHash;



customWeb3.eth.accounts.wallet.clear();
Object.entries(producerAccounts).forEach(([_, producer]) => {
  customWeb3.eth.accounts.wallet.add(customWeb3.eth.accounts.privateKeyToAccount(producer.pk));
});
Object.entries(warehouseAccounts).forEach(([_, warehouse]) => {
  customWeb3.eth.accounts.wallet.add(customWeb3.eth.accounts.privateKeyToAccount(warehouse.pk));
});


// console.log("All Accounts:", customWeb3.eth.accounts.wallet);
// for(let i=0; i<customWeb3.eth.accounts.wallet.length; i++){
//   const account = customWeb3.eth.accounts.wallet[i];
//   customWeb3.eth.getBalance(account.address)
//     .then(balance => console.log(`${i}. ${account.address} -> `, balance, Number(Web3.utils.fromWei(balance)).toPrecision(4), "eth" ));
// }


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
const InventProduct = SenderFactory(SourceTraceContract, 'inventProduct', true);


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
          CreateProducerFn(producer.address, producer.name, producer.phone, producer.reg_no, producer.physicalAddress)
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
          CreateWarehouseFn(warehouse.address, warehouse.name, warehouse.phone, warehouse.reg_no, warehouse.physicalAddress)
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

async function generateTestAccounts(count=10){
  console.log("Generating test accounts ...");

  const faucetKey = "d2f595c7f9e65d9d3f67098c9143e646c097bab946808ab52d720a194e00c8b3";
  const faucetAccount = customWeb3.eth.accounts.wallet.add(customWeb3.eth.accounts.privateKeyToAccount(faucetKey));
  console.log("Faucet account: ", faucetAccount);
  
  const gasPrice = await customWeb3.eth.getGasPrice();
  const gas = 21000;
  console.log("Gas", { gasPrice, gas });
  
  count = 9;
  const accounts: any[] = [];
  console.log("Generated accounts", accounts);

  for(let i=0; i<count; i++){
    const account = customWeb3.eth.accounts.create()
    const toAddress = account.address;
    const amountToSend = Web3.utils.toWei("0.02", "ether"); // Convert to wei value
    await customWeb3.eth.sendTransaction({
      from: faucetAccount.address,
      to: toAddress,
      value: amountToSend,
      gas: customWeb3.utils.toHex(gas), 
      gasPrice:  customWeb3.utils.toHex(gasPrice),
    });
    const balance = await customWeb3.eth.getBalance(account.address);
    accounts.push({
      ...account,
      balanceWei: balance,
      balanceEth: weiToEth(balance),
    });
    console.log(`${i}. ${account.address} -> `, weiToEth(balance) , "eth" );
  }
  
    console.log(JSON.stringify(accounts));
    accounts.forEach((account: any, idx) => {
      console.log(`${idx}. ${account.address} -> `, account.balanceEth , "eth" );
    })
}

async function createProducts(){
  console.log("Creating products ....");
  for(let entry of Object.entries(producerAccounts)){
    const [_, producer] = entry;
    for(let product of producer.products){
      const minValues = [product.temperature.min, product.humidity.min].map(val => temperatureToUnits(val))
      const maxValues = [product.temperature.max, product.humidity.max].map(val => temperatureToUnits(val));
      console.log("Creation params", {
        add: producer.address, name: product.name, price: String(product.price), DEFAULT_PRODUCT_IMAGE, params, minValues, maxValues
      });
      const imageURL = product.image || DEFAULT_PRODUCT_IMAGE;
      const receipt = await InventProduct(producer.address, product.name, String(product.price), imageURL, params, minValues, maxValues);
      console.log(`Invented product ${product.name} `, receipt);
    }
  }
}

export const SETUP_TOOL = {
  SourceTraceContract,
  createProducers,
  createWarehouses,
  generateTestAccounts,
  createProducts,
}
if(hasWindow()){
  window.SETUP_TOOL = SETUP_TOOL;
}


