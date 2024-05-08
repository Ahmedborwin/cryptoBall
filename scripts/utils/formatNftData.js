const fs = require("fs")

// Read data from the JSON file
const rawData = fs.readFileSync("./nft_data/player-data-essentials-pretty.json")
const data = JSON.parse(rawData)

// Convert data to an object keyed by full names
const convertedData = data.reduce((acc, player) => {
  const { full_name, ...attributes } = player
  acc[full_name] = attributes
  return acc
}, {})

// Format the data as a pretty-printed JSON string
const outputData = JSON.stringify(convertedData, null, 4)

// Write the output to a file
fs.writeFileSync("output.json", outputData)

console.log("Data has been successfully processed and saved to output.json.")
