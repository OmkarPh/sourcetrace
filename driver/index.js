const express = require("express");
const slashes = require("connect-slashes");
const cors = require("cors");
const { poll } = require("./trucks");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 5000;

// Setting up the server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(slashes(false));
app.listen(PORT, () => console.log(`Driver software is running on ${PORT}`));

let temperature = 25; // Set initial temperature to 25°C
let humidity = 50; // Set initial humidity to 50%
function validateFields() {
  if (!temperature) temperature = 25;
  if (!humidity) humidity = 50;
}

function randomRangeAbsolute(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChange() {
  return Math.random() - 0.5;
}

function activateSensor() {
  // Generate random changes for temperature and humidity
  const temperatureChange = randomChange();
  const humidityChange = randomChange();

  // Update temperature and humidity with the random changes
  temperature += temperatureChange;
  humidity += humidityChange;

  // Ensure that temperature and humidity stay within realistic ranges
  if (temperature < 10) {
    temperature = 10;
  } else if (temperature > 40) {
    temperature = 40;
  }

  if (humidity < 30) {
    humidity = 30;
  } else if (humidity > 70) {
    humidity = 70;
  }

  temperature = Number(temperature.toFixed(3));
  humidity = Number(humidity.toFixed(3));

  return {
    temperature,
    humidity,
    timestamp: new Date(),
  };
}

app.get("/driver/sensor", (req, res) => {
  res.status(200).json({
    ...activateSensor(),
  });
});

// Scenarios
const scenarios = {
  normal: {
    temp: {
      min: 23,
      max: 27,
    },
    humidity: {
      min: 43,
      max: 52,
    },
  },
  coldStorage: {
    temp: {
      min: 10,
      max: 15,
    },
    humidity: {
      min: 45,
      max: 60,
    },
  },
  coldStorageCompromised: {
    temp: {
      min: 19,
      max: 25,
    },
    humidity: {
      min: 61,
      max: 90,
    },
  },
};
function setComponentConditions(component) {
  if (!component) component = scenarios.normal;
  temperature =
    randomRangeAbsolute(component.temp.min, component.temp.max) +
    randomChange();
  humidity =
    randomRangeAbsolute(component.humidity.min, component.humidity.max) +
    randomChange();
}

app.get("/normal", (req, res) => {
  setComponentConditions(scenarios.normal);
  res.json({ message: "Success !", temperature, humidity });
});
app.get("/coldStorage", (req, res) => {
  setComponentConditions(scenarios.coldStorage);
  res.json({ message: "Success !", temperature, humidity });
});
app.get("/coldStorageCompromised", (req, res) => {
  setComponentConditions(scenarios.coldStorageCompromised);
  res.json({ message: "Success !", temperature, humidity });
});

const PERCENTAGE = 90;
const POLL_INTERVAL = 10 * 1000;

app.post("/start-polling", async (req, res) => {
  const {
    productLotId,
    truckAddress,
    minTemperature,
    maxTemperature,
    minHumidity,
    maxHumidity,
    timeLimit,
  } = req.body;

  console.log("\n--------------------------------");
  console.log("Received poll request with body", req.body);

  if (
    productLotId === undefined ||
    truckAddress === undefined ||
    minTemperature === undefined ||
    maxTemperature === undefined ||
    minHumidity === undefined ||
    maxHumidity === undefined ||
    timeLimit === undefined
  ) {
    return res.status(400).json({ message: "Invalid request !!" });
  }

  const lot_id_split = productLotId.split("_");
  const producerAddress = lot_id_split[0].toLowerCase();
  const lotIdx = Number(lot_id_split[1]);

  if (timeLimit <= -1) timeLimit = 600000; // default 10 mins

  const startTime = new Date().getTime();
  // console.log(`Poll will last for ${timeLimit/60000} mins`);

  // set up interval to generate values every 5 seconds
  const pollInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    console.log(`Elapsed(${elapsedTime}), timelimit ${timeLimit}`);
    if (elapsedTime >= timeLimit) {
      clearInterval(pollInterval);
      console.log("Stop polling ------------------------\n");
      return;
    }

    // generate values within range with 85% probability
    let temperature, humidity;
    temperature = Math.floor(
      Math.random() * (maxTemperature - minTemperature + 1) + minTemperature
    );
    humidity = Math.floor(
      Math.random() * (maxHumidity - minHumidity + 1) + minHumidity
    );
    if (Math.random() >= PERCENTAGE / 100) {
      // generate values slightly outside the specified range for 15% probability
      const rangeSize = Math.max(
        maxTemperature - minTemperature,
        maxHumidity - minHumidity
      );
      const deviation = Math.floor(Math.random() * (rangeSize / 10)) + 1;
      temperature =
        Math.random() < 0.5
          ? minTemperature - deviation
          : maxTemperature + deviation;
      humidity =
        Math.random() < 0.5 ? minHumidity - deviation : maxHumidity + deviation;
      console.log("Out of bound poll");
    }

    // print generated values to console
    // console.log("Polling ...", { temperature, humidity });
    try {
      poll(
        truckAddress,
        producerAddress,
        lotIdx,
        productLotId || "",
        temperature,
        humidity,
        () => {
          console.log("Stop polling ------------------------\n");
          clearInterval(pollInterval)
        }
      );
    } catch (err) {
      console.log("err polling", err);
    }
  }, POLL_INTERVAL);

  // send OK response without waiting for generateParams
  res.status(200).json({ message: "Success" });
});

// Test
app.get("/test", (req, res) => {
  res.status(200).send("Server is running !!");
});
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is running !!" });
});
app.get("/api/ping", (req, res) => {
  res.status(200).send("-- ok --");
});

// 404 pages for development
app.get("*", (req, res) => {
  res.status(404).send("API not found :(  <br> ¯\\_(ツ)_/¯");
});
