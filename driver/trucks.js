const { PollDetails } = require("./ContractAPI");
const { temperatureToUnits, humidityToUnits } = require("./util/general");


// productLotId -> in format 0x23..23_2
function poll(truckAddress, producerAddress, lotIdx, productLotId, temperature, humidity, stopPolling) {
  if (!productLotId) productLotId = "";
  console.log("Polling with params", {
    truckAddress,
    productLotId: productLotId.toLowerCase(),
    tUnits: temperatureToUnits(temperature),
    hUnits: humidityToUnits(humidity)
  });
  PollDetails(
    truckAddress,
    producerAddress.toLowerCase(),
    lotIdx,
    productLotId.toLowerCase(),
    temperatureToUnits(temperature),
    humidityToUnits(humidity)
  )
    .then((res) => {
      console.log(`Poll successful `, { temperature, humidity });
    })
    .catch((err) => {
      console.log("Error polling :(", err);
      stopPolling();
    });
}


module.exports = {
  poll
}