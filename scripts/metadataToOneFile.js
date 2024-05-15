const fs = require("fs")
const path = require("path")
const util = require("util")

const metadataDir = "./metadata" // Directory containing your JSON files
const outputFilePath = "./ALLPlayersMetaData.json" // Path for the output JSON file
const batchSize = 100 // Number of files to process before writing to disk
const maxFiles = 2100 // Maximum number of files to process

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function processFiles(directory) {
  const files = fs.readdirSync(directory)
  let result = {}
  let batchCounter = 0
  let isFirstBatch = true

  for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
    const filePath = path.join(directory, files[i])
    const fileKey = path.basename(files[i], ".json") // Remove the '.json' extension for the key

    try {
      const data = await readFile(filePath, "utf8")
      result[fileKey] = JSON.parse(data) // Add file data to result object
      batchCounter++

      // Write current batch to file and reset if batch size reached
      if (batchCounter === batchSize || i === maxFiles - 1) {
        await writeToFile(result, isFirstBatch)
        isFirstBatch = false
        result = {} // Reset result for next batch
        batchCounter = 0
      }
    } catch (err) {
      console.error(`Error reading file ${filePath}: ${err}`)
    }
  }

  // Final closure of JSON if not already closed
  if (!isFirstBatch) {
    await appendFinalClosure()
  }
}

async function writeToFile(data, isFirstBatch) {
  let dataString = JSON.stringify(data).slice(1, -1) // Remove the enclosing {}
  if (isFirstBatch) {
    dataString = "{" + dataString
  } else {
    dataString = "," + dataString
  }

  await writeFile(outputFilePath, dataString, { flag: "a" }) // Always append to file
  console.log(`Data batch written to ${outputFilePath}`)
}

async function appendFinalClosure() {
  await writeFile(outputFilePath, "}", { flag: "a" }) // Properly close the JSON object
  console.log(`Final closure added to ${outputFilePath}`)
}

// Start processing files
processFiles(metadataDir)
