const fs = require("fs").promises

async function updateNFTBaseData() {
  // Function to determine new club position based on attributes
  const determineClubPosition = (attributes) => {
    const attributeValues = attributes.reduce((acc, attribute) => {
      if (/^\d+$/.test(attribute.value)) {
        // Check if the value is a valid integer
        acc[attribute.name] = parseInt(attribute.value, 10)
      }
      return acc
    }, {})

    const maxAttribute = Object.keys(attributeValues).reduce(
      (a, b) => (attributeValues[a] > attributeValues[b] ? a : b),
      null
    )

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

  try {
    // Read the large JSON object from file
    const data = await fs.readFile("nft_data/ALLPlayersMetaData.json", "utf8")
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
      const position = player.club_position
      if (groupedPlayers[position]) {
        groupedPlayers[position].push(player)
      }
    })

    // Combine the grouped players into a single array
    const finalGroupedPlayers = [
      ...groupedPlayers.GoalKeeper,
      ...groupedPlayers.Defender,
      ...groupedPlayers.Midfielder,
      ...groupedPlayers.Attacker,
    ]

    // Write the updated object to a new JSON file
    await fs.writeFile("nft_data/updatedData.json", JSON.stringify(finalGroupedPlayers, null, 2))
    console.log("The file has been saved!")

    // Log the number of players in each category and their start and end indices
    const logCategoryInfo = (category) => {
      const players = groupedPlayers[category]
      const count = players.length
      const startIndex = count > 0 ? finalGroupedPlayers.indexOf(players[0]) : -1
      const endIndex = count > 0 ? startIndex + count - 1 : -1
      console.log(`${category}: ${count} players, Start Index: ${startIndex}, End Index: ${endIndex}`)
    }

    logCategoryInfo("GoalKeeper")
    logCategoryInfo("Defender")
    logCategoryInfo("Midfielder")
    logCategoryInfo("Attacker")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

updateNFTBaseData()
