import Web3 from "web3";
import customWeb3 from "./customWeb3";
import {
  DEFAULT_PRODUCT_IMAGE,
  hasWindow,
  humidityToUnits,
  params,
  temperatureToUnits,
  weiToEth,
} from "../../utils/general";
import SourceTraceABI from "../../contracts/SourceTraceABI.json";
import {
  contractAddress,
  // contractDeploymentTx,
  // contractDeploymentTxLink,
  chainExplorerBaseAddress,
} from "../../contracts/deploymentDetails";
import { producerAccounts, warehouseAccounts } from "./details";

const linkFromTxHash = (txHash: string) =>
  `${chainExplorerBaseAddress}/tx/` + txHash;

customWeb3.eth.accounts.wallet.clear();
Object.entries(producerAccounts).forEach(([_, producer]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(producer.pk)
  );
  producer.trucks?.forEach((truck) => {
    customWeb3.eth.accounts.wallet.add(
      customWeb3.eth.accounts.privateKeyToAccount(truck.pk)
    );
  });
});
Object.entries(warehouseAccounts).forEach(([_, warehouse]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(warehouse.pk)
  );
  warehouse.trucks?.forEach((truck) => {
    customWeb3.eth.accounts.wallet.add(
      customWeb3.eth.accounts.privateKeyToAccount(truck.pk)
    );
  });
});

console.log("Eth accounts", customWeb3.eth.accounts.wallet.length);

// console.log("All Accounts:", customWeb3.eth.accounts.wallet);
// for(let i=0; i<customWeb3.eth.accounts.wallet.length; i++){
//   const account = customWeb3.eth.accounts.wallet[i];
//   customWeb3.eth.getBalance(account.address)
//     .then(balance => console.log(`${i}. ${account.address} -> `, balance, Number(Web3.utils.fromWei(balance)).toPrecision(4), "eth" ));
// }

function CallerFn(
  Contract: any,
  method: string,
  debug: boolean,
  ...params: any[]
) {
  // console.log("Calling2");
  return new Promise((resolve, reject) => {
    Contract.methods[method](...params)
      .call()
      .then((res: any) => {
        if (debug) {
          console.log(`Called ${method} with params`, params, `\nResult:`, res);
        }
        resolve(res);
      })
      .catch((err: any) => {
        if (debug) {
          // console.log(
          //   `Some error calling ${method} with params \n`,
          //   params,
          //   err
          // );
        }
        reject(new Error(`Couldn't fetch results for ${method}`));
      });
  });
}

function SenderFn(
  Contract: any,
  method: string,
  senderAddress: string,
  debug: boolean,
  ...params: any[]
) {
  return new Promise(async (resolve, reject) => {
    let gasprice = Number(await customWeb3.eth.getGasPrice());
    gasprice = Math.round(gasprice * 1.2); // to speed up 1.2 times..

    const tx = Contract.methods[method](...params);
    var gas_estimate = await tx.estimateGas({ from: senderAddress });
    gas_estimate = Math.round(gas_estimate * 1.2);

    if (debug) {
      // console.log("Prepared transaction: ", tx);
    }

    tx.send({
      from: senderAddress,
      gas: customWeb3.utils.toHex(gas_estimate),
      gasPrice: customWeb3.utils.toHex(gasprice),
    })
      .then((receipt: any) => {
        // console.log(`${method} - Tx Receipt`, receipt);
        console.log(`Transaction hash: ${receipt?.transactionHash}`);
        // console.log(
        //   `View the transaction here: `,
        //   linkFromTxHash(receipt?.transactionHash)
        // );
        return resolve(receipt);
      })
      .catch((err: any) => {
        console.log(`Some error sending ${method} with params \n`, params, err);
        reject(new Error(`Couldn't send tx for ${method}`));
      });
  });
}

function CallerFactory(Contract: any, method: string, debug: boolean) {
  return (...params: any[]) => CallerFn(Contract, method, debug, ...params);
}
function SenderFactory(Contract: any, method: string, debug: boolean) {
  return (address: string, ...params: any[]) =>
    SenderFn(Contract, method, address, debug, ...params);
}

const SourceTraceContract = new customWeb3.eth.Contract(
  SourceTraceABI as any,
  contractAddress
);
const GetProducer = CallerFactory(SourceTraceContract, "getProducer", false);
const GetWarehouse = CallerFactory(SourceTraceContract, "getWarehouse", false);
const CreateProducerFn = SenderFactory(
  SourceTraceContract,
  "createProducer",
  true
);
const CreateWarehouseFn = SenderFactory(
  SourceTraceContract,
  "createWarehouse",
  true
);
const InventProduct = SenderFactory(SourceTraceContract, "inventProduct", true);
const CreateProductLot = SenderFactory(
  SourceTraceContract,
  "createProductLot",
  true
);
const CreateCheckInFn = SenderFactory(SourceTraceContract, 'createCheckIn', true);
const CreateCheckOutFn = SenderFactory(SourceTraceContract, 'createCheckOut', true);




// const CreateCheckIn = async (address: string, ...params: any[]) => {
//   // try {
//   //   const receipt = await CreateCheckInFn(address, ...params);
//   //   return receipt;
//   // } catch(err) {
//   //   return null;
//   // }
// }
// const CreateCheckOut = async (
//   address: string,
//   ...params: any[]
// ) => {
//   // try {
//   //   const receipt = await CreateCheckOutFn(address, ...params);
//   //   return receipt;
//   // } catch(err) {
//   //   return null;
//   // }
// }

function createProducers(limit = 10) {
  console.log("Creating producers ....");
  const promises: Promise<any>[] = [];
  Object.entries(producerAccounts).forEach(([key, producer], idx) => {
    if (idx >= limit) return;
    const promise = new Promise((resolve, reject) => {
      GetProducer(producer.address)
        .then((response) => {
          console.log(`${idx}. ${key} Producer already registered: `, response);
          reject(response);
        })
        .catch((err) => {
          {
            console.log(
              `${idx}. ${key} Producer not registered, Creating ... `,
              producer.address
            );
            const truckDetails =
              producer.trucks?.map((truck) => truck.truckLicensPlate) || [];
            const truckAddresses =
              producer.trucks?.map((truck) => truck.address) || [];
            CreateProducerFn(
              producer.address,
              producer.name,
              producer.phone,
              producer.reg_no,
              producer.physicalAddress,
              truckAddresses,
              truckDetails
            ).then((receipt) => {
              console.log(
                `${idx}. Created producer ${key} with receipt: `,
                receipt
              );
              return resolve(receipt);
            });
          }
        });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(function (results) {
    console.log("Producers setup complete ------:", results);
    console.log("Verification ");
    Object.entries(producerAccounts).forEach(([key, producer], idx) => {
      new Promise((resolve, reject) => {
        GetProducer(producer.address)
          .then((response) => {
            console.log(
              `${idx}. ${key} Producer registered: `
              // response
            );
            resolve(response);
          })
          .catch((err) => {
            {
              reject("Not registered");
            }
          });
      });
    });
  });
}
function createWarehouses(limit = 10) {
  console.log("Creating warehouses ....");

  const promises: Promise<any>[] = [];
  Object.entries(warehouseAccounts).forEach(([key, warehouse], idx) => {
    if (idx >= limit) return;
    const promise = new Promise((resolve, reject) => {
      GetWarehouse(warehouse.address)
        .then((response) => {
          console.log(
            `${idx}. ${key} Warehouse already registered: `,
            response
          );
          reject(response);
        })
        .catch((err) => {
          {
            console.log(
              `${idx}. ${key} Warehouse not registered, Creating ... `,
              warehouse.address
            );
            const truckDetails =
              warehouse.trucks?.map((truck) => truck.truckLicensPlate) || [];
            const truckAddresses =
              warehouse.trucks?.map((truck) => truck.address) || [];
            CreateWarehouseFn(
              warehouse.address,
              warehouse.name,
              warehouse.phone,
              warehouse.reg_no,
              warehouse.physicalAddress,
              truckAddresses,
              truckDetails
            ).then((receipt) => {
              console.log(
                `${idx}. Created Warehouse ${key} with receipt: `,
                receipt
              );
              return resolve(receipt);
            });
          }
        });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(function (results) {
    console.log("Warehouse setup complete ------", results);
    console.log("Verification ");
    Object.entries(warehouseAccounts).forEach(([key, warehouse], idx) => {
      new Promise((resolve, reject) => {
        GetWarehouse(warehouse.address)
          .then((response) => {
            console.log(
              `${idx}. ${key} Warehouse registered `
              // response
            );
            resolve(response);
          })
          .catch((err) => {
            {
              reject("Not registered");
            }
          });
      });
    });
  });
}

async function generateTestAccounts(count = 10) {
  console.log("Generating test accounts ...");

  // Address - 0x2e19c30c88D21f1b085B4C5A283D68e8c3eD754c
  const faucetKey =
    "d2f595c7f9e65d9d3f67098c9143e646c097bab946808ab52d720a194e00c8b3";
  const faucetAccount = customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(faucetKey)
  );
  console.log("Faucet account: ", faucetAccount);
  const gasPrice = await customWeb3.eth.getGasPrice();
  const gas = 21000;
  console.log("Gas", { gasPrice, gas });

  const accounts: any[] = [];
  console.log("Generated accounts", accounts);

  for (let i = 0; i < count; i++) {
    const account = customWeb3.eth.accounts.create();
    const toAddress = account.address;
    const amountToSend = Web3.utils.toWei("0.02", "ether"); // Convert to wei value
    await customWeb3.eth.sendTransaction({
      from: faucetAccount.address,
      to: toAddress,
      value: amountToSend,
      gas: customWeb3.utils.toHex(gas),
      gasPrice: customWeb3.utils.toHex(gasPrice),
    });
    const balance = await customWeb3.eth.getBalance(account.address);
    accounts.push({
      ...account,
      balanceWei: balance,
      balanceEth: weiToEth(balance),
    });
    console.log(`${i}. ${account.address} -> `, weiToEth(balance), "eth");
  }

  console.log(JSON.stringify(accounts));
  accounts.forEach((account: any, idx) => {
    console.log(`${idx}. ${account.address} -> `, account.balanceEth, "eth");
  });
}

async function createProducts() {
  console.log("Creating products ....");
  let idx = 0;
  for (let entry of Object.entries(producerAccounts)) {
    if (idx > 2) break;
    idx++;
    const [_, producer] = entry;
    for (let product of producer.products) {
      const minValues = [
        temperatureToUnits(product.temperature.min),
        humidityToUnits(product.humidity.min),
        product.timeLimit?.min || -1,
      ];
      const maxValues = [
        temperatureToUnits(product.temperature.max),
        humidityToUnits(product.humidity.max),
        product.timeLimit?.max || -1,
      ];
      // console.log("Creation params", {
      //   add: producer.address,
      //   name: product.name,
      //   price: String(product.price),
      //   DEFAULT_PRODUCT_IMAGE,
      //   params,
      //   minValues,
      //   maxValues,
      // });
      const imageURL = product.image || DEFAULT_PRODUCT_IMAGE;
      const receipt = await InventProduct(
        producer.address,
        product.name,
        String(product.price),
        imageURL,
        params,
        minValues,
        maxValues
      );
      console.log(
        `Producer ${producer.address} - Created product ${product.name} with receipt`,
        receipt
      );
    }
  }
}

async function createProductLots() {
  console.log("Creating product lots ....");
  let idx = 0;
  for (let entry of Object.entries(producerAccounts)) {
    if (idx > 2) break;
    idx++;
    const [_, producer] = entry;
    let productIdx = 0;
    for (let product of producer.products) {
      let lotIdx = 0;
      for (let lot of product.lots || []) {
        console.log("Lot creation params", {
          producer: producer.address,
          lot_size: lot.lot_size,
          productId: lot.productId,
          name: producer.name,
          location: producer.address,
          tempUnits: lot.tempUnits,
          humidityUnits: lot.humidityUnits,
        });

        const receipt = await CreateProductLot(
          producer.address,
          lot.lot_size,
          lot.productId,
          producer.name,
          producer.physicalAddress,
          lot.tempUnits,
          lot.humidityUnits,
        );
        console.log(
          `Producer ${producer.name} - Created Product_${productIdx} - lot_${lotIdx} with receipt`,
          receipt
        );
        // console.log(`Producer ${producer.name} - Created Product_${productIdx} - lot_${lotIdx}`);
        lotIdx++;
      }
      productIdx++;
    }
  }
  console.log("Created all preset lots");
  
}

async function testCheckpoints() {
  console.log("Testing checkpoints ....");
  let idx = 0;
  for (let entry of Object.entries(producerAccounts)) {
    if (idx > 2) break;
    idx++;
    const [_, producer] = entry;
    let productIdx = 0;
    for (let product of producer.products) {
      let lotIdx = 0;
      for (let lot of product.lots || []) {
        for(let checkpoint of lot.checkpoints || []){          
          console.log("Checkin tx params", {
            actionTaker: checkpoint.warehouse.address,
            producerAddress: producer.address,
            lotId: lotIdx,
            tempUnits: checkpoint.in.tempUnits,
            humidityUnits: checkpoint.in.humidityUnits,
          });
          const receipt = await CreateCheckInFn(
            checkpoint.warehouse.address,
            producer.address,
            lotIdx,
            checkpoint.in.tempUnits,
            checkpoint.out.humidityUnits,
          )
          console.log(
            `Warehouse ${checkpoint.warehouse.name} - Check in ${producer.name} - lot_${lotIdx} with receipt`,
            receipt
          );

          if(receipt)
          // if(
          //   checkpoint.in.tempUnits >= temperatureToUnits(product.temperature.min) &&
          //   checkpoint.in.tempUnits <= temperatureToUnits(product.temperature.max) &&
          //   checkpoint.in.humidityUnits >= humidityToUnits(product.humidity.min) &&
          //   checkpoint.in.humidityUnits <= humidityToUnits(product.humidity.max)
          // )
            console.log(
              `Warehouse ${checkpoint.warehouse.name} - Check in ${producer.name} - lot_${lotIdx}`,
            );
          else {
            console.log(`----- Invalid params, can't checkin -----`);
            continue;
          }
            

          const availableTrucks = checkpoint.warehouse.trucks || [];
          console.log("Checkout tx params", {
            actionTaker: checkpoint.warehouse.address,
            producerAddress: producer.address,
            lotId: lotIdx,
            truckAddress: availableTrucks[0].address,
            truckIdx: 0,
            tempUnits: checkpoint.in.tempUnits,
            humidityUnits: checkpoint.in.humidityUnits,
          });
          const checkoutReceipt = await CreateCheckOutFn(
            checkpoint.warehouse.address,
            producer.address,
            lotIdx,
            checkpoint.out.tempUnits,
            checkpoint.out.humidityUnits,
          )
          console.log(
            `Warehouse ${checkpoint.warehouse.name} - Check out ${producer.name} - lot_${lotIdx} with receipt`,
            receipt
          );
          if(checkoutReceipt)
          // if(
          //   checkpoint.out.tempUnits >= temperatureToUnits(product.temperature.min) &&
          //   checkpoint.out.tempUnits <= temperatureToUnits(product.temperature.max) &&
          //   checkpoint.out.humidityUnits >= humidityToUnits(product.humidity.min) &&
          //   checkpoint.out.humidityUnits <= humidityToUnits(product.humidity.max)
          // )
          console.log(
            `Warehouse ${checkpoint.warehouse.name} - Check out ${producer.name} - lot_${lotIdx}`,
          );
          else {
            console.log(`----- Invalid params, can't checkout -----`);
            continue;
          }
          // console.log(`Producer ${producer.name} - Created Product_${productIdx} - lot_${lotIdx}`);
        }
        console.log("----------------------------------------");
        lotIdx++;
      }
      productIdx++;
    }
  }
  console.log("Check in & check out tested for all preset lots");
}

export const SETUP_TOOL = {
  SourceTraceContract,
  createProducers,
  createWarehouses,
  generateTestAccounts,
  createProducts,
  createProductLots,
  testCheckpoints,
};
if (hasWindow()) {
  window.SETUP_TOOL = SETUP_TOOL;
}
