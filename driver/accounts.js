const Web3 = require('web3');
const { producerAccounts, warehouseAccounts } = require('./details');

const providerURL = `https://rpc-mumbai.maticvigil.com/`;

const customWeb3 = new Web3(providerURL);

customWeb3.eth.accounts.wallet.clear();
Object.entries(producerAccounts).forEach(([_, producer]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(producer.pk)
  );
  producer.trucks?.forEach(truck => {
    customWeb3.eth.accounts.wallet.add(
      customWeb3.eth.accounts.privateKeyToAccount(truck.pk)
    );
  })
});
Object.entries(warehouseAccounts).forEach(([_, warehouse]) => {
  customWeb3.eth.accounts.wallet.add(
    customWeb3.eth.accounts.privateKeyToAccount(warehouse.pk)
  );
  warehouse.trucks?.forEach(truck => {
    customWeb3.eth.accounts.wallet.add(
      customWeb3.eth.accounts.privateKeyToAccount(truck.pk)
    );
  })
});

console.log("Eth accounts", customWeb3.eth.accounts.wallet.length);

module.exports = customWeb3;