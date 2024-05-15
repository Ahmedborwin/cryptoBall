const fs = require("fs")
const path = require("path")

// Function to read the JSON file, reassign keys, and write back to the file
async function reassignKeys(filePath) {
  try {
    // Read the file
    const data = await fs.promises.readFile(filePath, "utf8")
    const players = JSON.parse(data)

    // Create a new object to hold the re-keyed players
    const updatedPlayers = {}
    let counter = 0 // Start key from 0

    // Iterate over the original object and assign to new keys
    for (const key in players) {
      updatedPlayers[counter.toString()] = players[key]
      counter++
    }

    // Write the updated JSON back to the file or a new file
    await fs.promises.writeFile(filePath, JSON.stringify(updatedPlayers, null, 2), "utf8")
    console.log("Keys have been reassigned and file updated successfully.")
  } catch (error) {
    console.error("Failed to read or write the file:", error)
  }
}

// Specify the path to your JSON file
const filePath = path.join(__dirname, "../../nft_data/ALLPlayersMetaData.json") // Update 'yourJsonFileName.json' to your actual file name

// Run the function
reassignKeys(filePath)
