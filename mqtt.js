const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

const api = "/6p2j47r8c5rh9ahuxeowkb7a";
const topic = "/Streetlight";
const device = "/Light:001";
const attrs = "/attrs";
const topicWithAPI = api + device + attrs;

const mqttConnect = () => {
  client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`);
    });
  });
};

const mqttPublish = (generateRandomAttributes) => {
  client.publish(
    topicWithAPI,
    generateRandomAttributes,
    {qos: 0, retain: false},
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
};

module.exports = {mqttPublish, mqttConnect};
