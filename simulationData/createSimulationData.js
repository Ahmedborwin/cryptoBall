const fs = require("fs")

function createData() {
  // Helper function to read and parse JSON file
  function readData(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading the file:", err)
          reject(err)
        } else {
          try {
            // Parse the JSON data
            const jsonData = JSON.parse(data)
            // Convert each object to a string and store in an array
            const stringArray = jsonData.map((obj) => JSON.stringify(obj))
            resolve(stringArray)
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError)
            reject(parseError)
          }
        }
      })
    })
  }

  // Function to generate a random numbers array as strings
  function generateRandomNumbers() {
    let numbers = []
    for (let i = 0; i < 5; i++) {
      numbers.push(Math.floor(Math.random() * 100).toString())
    }
    return numbers
  }

  // Combine the data from both teams and the random numbers into one ArgsArray
  async function generateArgsArray() {
    try {
      const stringImplementationTeam1 = await readData("./Team1.json")
      const stringImplementationTeam2 = await readData("./Team2.json")
      const randomNumbers = generateRandomNumbers()
      ArgsArray = [...stringImplementationTeam1, ...stringImplementationTeam2, ...randomNumbers]
      return ArgsArray
    } catch (error) {
      console.error("Failed to generate args array:", error)
    }
  }

  // Use the result of generateArgsArray
  generateArgsArray()
    .then((ArgsArray) => {
      if (ArgsArray) {
        console.log("ArgsArray generated successfully:")
      } else {
        console.log("No ArgsArray was generated due to an error.")
      }
    })
    .catch((error) => {
      console.error("Error in generating ArgsArray:", error)
    })
}

createData().catch((e) => {
  console.error(e)
  process.exit(1)
})
