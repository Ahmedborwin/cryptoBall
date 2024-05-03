const fs = require("fs")

// Function to generate random integers in a range
function randomPlayers(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to generate random values for an array
function generateArrayValues(count, min, max) {
  return Array.from({ length: count }, () => randomPlayers(min, max))
}

// Function to generate player data
function generatePlayers(numPlayers) {
  const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"]
  let players = []

  for (let i = 1; i <= numPlayers; i++) {
    let position = positions[Math.floor(Math.random() * positions.length)]
    let goalkeeping = position === "Goalkeeper" ? randomPlayers(50, 99) : randomPlayers(1, 10)

    let player = {
      player_id: i,
      name: `Player ${i}`,
      positions: position,
      overall_rating: randomPlayers(60, 100),
      potential: randomPlayers(60, 100),
      value: randomPlayers(1, 100) * 1000000,
      Attack: randomPlayers(50, 99),
      Midfield: randomPlayers(50, 99),
      Defense: randomPlayers(50, 99),
      Goalkeeping: goalkeeping,
    }

    players.push(player)
  }

  return players
}

// Generate data for 60 players
let playersData = generatePlayers(60)

// Write the data to a JSON file
fs.writeFile("playersData.json", JSON.stringify(playersData, null, 2), (err) => {
  if (err) {
    console.error("Error writing file:", err)
  } else {
    console.log("File has been written successfully")
  }
})

randomPlayers()
