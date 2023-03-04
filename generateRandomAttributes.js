function generateRandomAttributes() {
  // Generate a random voltage between 100 and 500 volts
  let voltage = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

  // Generate a random current between 10 and 50 amperes
  let current = Math.floor(Math.random() * (50 - 10 + 1)) + 10;

  // Calculate the power using the formula P = V * I
  let power = voltage * current;

  // Generate a random frequency between 50 and 60 hertz
  let frequency = Math.floor(Math.random() * (60 - 50 + 1)) + 50;

  // Create an object to store the attributes
  let attributes = `v|${voltage}|c|${current}|p|${power}|f|${frequency}`;

  // Return the object with the attributes
  return attributes;
}

module.exports = {generateRandomAttributes};
