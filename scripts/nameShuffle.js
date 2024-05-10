const fs = require("fs")

/**
 * Function that scrambles names slightly to make them unique but recognizable
 * @param {Object} data - JSON object containing the original information
 * @returns {Object} - Modified JSON object with scrambled names
 */
function scrambleName(data) {
  // Function to switch characters between two names (first and last)
  function scrambleSingleName(name) {
    // Split name into words
    const nameParts = name.split(" ")

    // Helper function to swap the first characters of two words
    function swapFirstCharacters(word1, word2) {
      if (word1.length > 0 && word2.length > 0) {
        return [word2[0] + word1.slice(1), word1[0] + word2.slice(1)]
      }
      return [word1, word2] // In case one or both words are empty
    }

    // Apply the swap function if there are multiple parts
    if (nameParts.length > 1) {
      ;[nameParts[0], nameParts[1]] = swapFirstCharacters(nameParts[0], nameParts[1])
    }

    // Join back to a full name
    return nameParts.join(" ")
  }

  // Scramble the name in the data object
  const scrambledName = scrambleSingleName(data.name)

  // Return a new object with the updated name
  return {
    ...data,
    name: scrambledName,
  }
}

/**
 * Function to iterate through an array of JSON objects, scramble names, and write to a file
 * @param {Array} dataArray - Array of JSON objects to process
 * @param {string} outputFilePath - File path to write the modified JSON objects
 */
function scrambleNamesAndWriteToFile(dataArray, outputFilePath) {
  // Map over the input array and apply the scrambleName function
  const scrambledArray = dataArray.map(scrambleName)

  // Write the scrambled array to a file
  fs.writeFile(outputFilePath, JSON.stringify(scrambledArray, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err)
    } else {
      console.log(`Scrambled data successfully written to ${outputFilePath}`)
    }
  })
}

/**
 * Main function that handles reading input JSON file, processing it, and saving to output file
 */
function main() {
  // Get command-line arguments: input and output file paths
  const inputFile = process.argv[2]
  const outputFile = process.argv[3]

  if (!inputFile || !outputFile) {
    console.error("Usage: node scrambleNamesFile.js <inputFile.json> <outputFile.json>")
    process.exit(1)
  }

  // Read the input JSON file
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading input file:", err)
      return
    }

    // Parse JSON data
    let dataArray
    try {
      dataArray = JSON.parse(data)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      return
    }

    // Scramble names and write to output file
    scrambleNamesAndWriteToFile(dataArray, outputFile)
  })
}

// Execute the main function
main()
