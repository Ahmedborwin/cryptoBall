const fs = require("fs")

// Function to determine new club position based on attributes
const determineClubPosition = (attributes) => {
  const attributeValues = attributes.reduce((acc, attribute) => {
    acc[attribute.name] = parseInt(attribute.value, 10)
    return acc
  }, {})

  const maxAttribute = Object.keys(attributeValues).reduce((a, b) => (attributeValues[a] > attributeValues[b] ? a : b))

  switch (maxAttribute) {
    case "goalkeeping":
      return "GoalKeeper"
    case "defense":
      return "Defender"
    case "midfield":
      return "Midfielder"
    case "attack":
      return "Attacker"
    default:
      return "Unknown"
  }
}

// Read the large JSON object from file
fs.readFileSync("nft_data/ALLPlayersMetaData.json", "utf8", (err, data) => {
  if (err) throw err

  const players = JSON.parse(data)

  // Update club positions based on highest attribute
  Object.keys(players).forEach((key) => {
    const player = players[key]
    player.club_position = determineClubPosition(player.attributes)
  })

  // Group players by club_position
  const groupedPlayers = {
    GoalKeeper: [],
    Defender: [],
    Midfielder: [],
    Attacker: [],
  }

  Object.keys(players).forEach((key) => {
    const player = players[key]
    groupedPlayers[player.club_position].push(player)
  })

  // Combine the grouped players into a single object
  const finalGroupedPlayers = {
    ...groupedPlayers.GoalKeeper,
    ...groupedPlayers.Defender,
    ...groupedPlayers.Midfielder,
    ...groupedPlayers.Attacker,
  }

  // Write the updated object to a new JSON file
  fs.writeFile("updatedData.json", JSON.stringify(finalGroupedPlayers, null, 2), (err) => {
    if (err) throw err
    console.log("The file has been saved!")
  })
})
