const Web3 = require('web3');
const { producerAccounts, warehouseAccounts } = require('./details');
const { extraTrucksPk } = require('./extraTrucks');

const providerURL = `https://rpc-mumbai.maticvigil.com/`;

const customWeb3 = new Web3(providerURL);

const truckAccounts = [];

customWeb3.eth.accounts.wallet.clear();
Object.entries(producerAccounts).forEach(([_, producer]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(producer.pk)
  );
  producer.trucks?.forEach(truck => {
    const account = customWeb3.eth.accounts.privateKeyToAccount(truck.pk);
    customWeb3.eth.accounts.wallet.add(account);
    truckAccounts.push(account.address);
  })
});
Object.entries(warehouseAccounts).forEach(([_, warehouse]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(warehouse.pk)
  );
  warehouse.trucks?.forEach(truck => {
    const account = customWeb3.eth.accounts.privateKeyToAccount(truck.pk);
    customWeb3.eth.accounts.wallet.add(account);
    truckAccounts.push(account.address);
  })
});
extraTrucksPk.forEach(pk => {
  const account = customWeb3.eth.accounts.privateKeyToAccount(pk);
  customWeb3.eth.accounts.wallet.add(account);
  truckAccounts.push(account.address);
});

console.log("Eth accounts", customWeb3.eth.accounts.wallet.length);
console.log("Trucks available:", truckAccounts);

module.exports = customWeb3;