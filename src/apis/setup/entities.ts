import Web3 from "web3";
import customWeb3 from "./customWeb3"

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