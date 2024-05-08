const fs = require("fs") // Require the file system module

// Read and parse the JSON file
const playersData = JSON.parse(fs.readFileSync("nft_data/player-data-essential-formatted.json").toString())

const calculateAttributes = (player) => {
  return {
    attack: Math.round(
      (parseInt(player.finishing) +
        parseInt(player.dribbling) +
        parseInt(player.acceleration) +
        parseInt(player.shot_power) +
        parseInt(player.long_shots) +
        parseInt(player.positioning) +
        parseInt(player.sprint_speed) +
        parseInt(player.reactions) +
        parseInt(player.agility)) /
        9
    ),
    defense: Math.round(
      (parseInt(player.standing_tackle) +
        parseInt(player.sliding_tackle) +
        parseInt(player.defensive_awareness) +
        parseInt(player.strength) +
        parseInt(player.aggression) +
        parseInt(player.interceptions)) /
        6
    ),
    midfield: Math.round(
      (parseInt(player.short_passing) +
        parseInt(player.long_passing) +
        parseInt(player.vision) +
        parseInt(player.ball_control) +
        parseInt(player.composure) +
        parseInt(player.reactions) +
        parseInt(player.agility) +
        parseInt(player.stamina)) /
        8
    ),
    goalkeeping: Math.round(
      (parseInt(player.gk_diving) +
        parseInt(player.gk_handling) +
        parseInt(player.gk_kicking) +
        parseInt(player.gk_positioning) +
        parseInt(player.gk_reflexes)) /
        5
    ),
  }
}

const processPlayers = (data, chunkSize = 100) => {
  // Convert the object to an array if it's not already one
  const entries = Array.isArray(data)
    ? data
    : Object.entries(data).map(([name, attributes]) => ({ name, ...attributes }))

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize)
    const result = chunk.map((player, index) => {
      console.log(`Processing player ${i + index + 1} of ${entries.length}: ${player.name}`)
      const playerAttributes = calculateAttributes(player)
      return {
        name: player.name,
        club_position: player.club_position,
        attributes: {
          overall_rating: player.overall_rating,
          potential: player.potential,
          attack: playerAttributes.attack,
          defense: playerAttributes.defense,
          midfield: playerAttributes.midfield,
          goalkeeping: playerAttributes.goalkeeping,
        },
      }
    })

    // Sort each chunk
    result.sort((a, b) => b.overall_rating - a.overall_rating)

    // Convert results to JSON and append to the file, handling commas for JSON array
    const jsonContent =
      result.map((res, idx) => JSON.stringify(res, null, 2)).join(",\n") +
      (i + chunkSize < entries.length ? ",\n" : "\n")
    fs.appendFileSync("nft_data/PlayerMetaData.json", jsonContent, "utf8")

    console.log(`Chunk ${i / chunkSize} saved successfully.`)
  }

  // Close the JSON array in the file
  fs.appendFileSync("nft_data/PlayerMetaData.json", "]", "utf8")
}

processPlayers(playersData)

processPlayers(playersData)
