const Web3 = require("web3");

const weiToEth = (wei) => Number(Web3.utils.fromWei(wei)).toPrecision(4);

const timestampToDate = (timestamp) => new Date(Number(timestamp)*1000);
const dateToTimestamp = (date) => Number((Number(date)/1000).toFixed())
const currDateToTimestamp = () => dateToTimestamp(new Date());

const unitsToTemperature = (units) => Number(units)/100;
const unitsToHumidity = (units) => Math.max(0, Number(units)/100); // Cap

const temperatureToUnits = (temperature) => Number(Number(Number(temperature) * 100).toFixed());
const humidityToUnits = (humidity) => Number(Number(Number(humidity) * 100).toFixed());

const productIdentifierToDetails = (text) => {
  const split = text.split('_');
  return {
    producer: split[0],
    id: Number(split[1]),
  }
}

console.log({
  // weiToEth,
  // timestampToDate,
  // dateToTimestamp,
  // currDateToTimestamp,
  temperatureToUnits,
  humidityToUnits,
  unitsToTemperature,
  unitsToHumidity,
  // productIdentifierToDetails
});
module.exports = {
  weiToEth,
  timestampToDate,
  dateToTimestamp,
  currDateToTimestamp,
  temperatureToUnits,
  humidityToUnits,
  unitsToTemperature,
  unitsToHumidity,
  productIdentifierToDetails
}