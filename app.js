const express = require("express");
const app = express();
const port = 3001;
const requestIP = require("request-ip");

const {mqttConnect, mqttPublish} = require("./mqtt.js");
const {generateRandomAttributes} = require("./generateRandomAttributes.js");

const IOTA_URL_DEV = "localhost:7896";
const IOTA_URL_PROD = null;

const IOTA_DEVICE = null;
const IOTA_API = "4jggokgpepnvsb2uv4s40d59ov2";

app.get("/", function (req, res) {
  postRequest("temperature002");
  res.send("OK");
});

// RANDOM NUMBER TO SIMULATE API

const randomValue = () => {
  return Math.floor(Math.random() * 10);
};

// async function getResponse(url, ipAddress) {
//   const response = await fetch(url, {
//     method: "GET",
//   });

//   const data = await response.json(); // Extracting data as a JSON Object from the response

//   return data;
// }

// Call postRequest every 5 minutes (300000 milliseconds)
let intervalHandler = setInterval(postRequestMQTT, 5 * 60 * 10);

// Set the maximum number of retries (6 times * 5 minutes = 30 minutes)
const maxRetries = 6;

// Initialize a variable to count the number of retries
let retryCount = 0;

// Define a function that sends a notification when the program stops
function sendNotification(message) {
  console.log(message);
}

function shouldRetry(error, retryCount) {
  // Check if retry count has reached maximum limit
  if (retryCount >= maxRetries) {
    // Stop retrying and send notification with error message
    clearInterval(intervalHandler);
    sendNotification("Program stopped due to error: " + error.message);
    // Return false to indicate no retry
    return false;
  } else {
    // Log error message and retry count
    sendNotification("Program stopped due to error: " + error.message);
    console.error("Error:", error.message);
    console.log("Retrying... (" + retryCount + "/" + maxRetries + ")");
    // Return true to indicate retry
    return true;
  }
}

// postRequestIOTA function with retry logic
function postRequestIOTA(device) {
  // Recieve the device as an argument and pass it to the IOTA_URL
  const IOTA_DEVICE = device;
  const IOTA_URL = `http://${IOTA_URL_DEV}/iot/d?k=${IOTA_API}&i=${IOTA_DEVICE}`;
  // Use fetch with IOTA_URL and options as arguments
  fetch(IOTA_URL, {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: `e|${randomValue()}`,
  })
    // Handle successful response
    .then((res) => res.json())
    .then((data) => console.log("Success:", data))
    // Handle error response
    .catch((error) => {
      // Increment retry count by one
      retryCount++;
      // Check if retry count has reached maximum limit
      if (!shouldRetry(error, retryCount)) {
        // If there are no more retries left the program with exit code 1
        process.exit(1);
      }
    });
}

// postRequestIOTA function with retry logic
function postRequestMQTT() {
  try {
    // Send random attributes to MQTT
    mqttPublish(generateRandomAttributes());
    console.log(generateRandomAttributes());
    // Handle error response
  } catch (error) {
    // Increment retry count by one
    retryCount++;
    // Check if retry count has reached maximum limit
    if (!shouldRetry(error, retryCount)) {
      // If there are no more retries left the program with exit code 1
      process.exit(1);
    }
  }
}

mqttConnect();

// SERVER UP

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
