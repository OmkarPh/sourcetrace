const { PollDetails } = require("./ContractAPI");
const { temperatureToUnits, humidityToUnits } = require("./util/general");


// productLotId -> in format 0x23..23_2
function poll(truckAddress, productLotId, temperature, humidity) {
  if (!productLotId) productLotId = "";
  console.log("Polled with params", {
    addr: truckAddress,
    productLotId: productLotId.toLowerCase(),
    tUnits: temperatureToUnits(temperature),
    hUnits: humidityToUnits(humidity)
  });
  PollDetails(
    truckAddress,
    productLotId.toLowerCase(),
    temperatureToUnits(temperature),
    humidityToUnits(humidity)
  )
    .then((res) => {
      console.log(`Poll successful `, { temperature, humidity });
    })
    .catch((err) => {
      console.log("Error polling :(", err);
    });
}


module.exports = {
  poll
}