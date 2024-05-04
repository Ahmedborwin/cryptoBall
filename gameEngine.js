const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")
const { gzip, ungzip } = await import("node:zlib")
const gzipAsync = promisify(gzip)

//Test Game engine mechanics
//expects meta data for 11 players for each team and an array of random nummbers to be
// Assuming arguments contains 22 player names followed by 5 random integers

// Parsing player data into objects
const team1 = args.slice(0, 4).map((playerJson) => JSON.parse(playerJson))
const team2 = args.slice(6, 10).map((playerJson) => JSON.parse(playerJson))
const randomFactors = args.slice(22, 27).map(Number)

// Simulate a match
function simulateMatch() {
  console.log("Starting match simulation...")

  // Assuming team1 and team2 are arrays of JSON strings similar to the earlier example
  let scoreTeam1 =
    team1.reduce((acc, player) => {
      return acc + player.Attack + player.Midfield + player.Defense
    }, 0) /
      1000 +
    (randomFactors[0] % 3)
  console.log("Score for Team 1 calculated.")

  let scoreTeam2 =
    team2.reduce((acc, player) => {
      console.log("Processing player for Team 2:", player.name)
      return acc + player.Attack + player.Midfield + player.Defense
    }, 0) /
      1000 +
    (randomFactors[1] % 3)
  console.log("Score for Team 2 calculated.")

  const goalsTeam1 = Math.round(scoreTeam1)
  const goalsTeam2 = Math.round(scoreTeam2)
  console.log("Goals calculated for both teams.", goalsTeam1, goalsTeam2)

  // Apply results to players' attributes
  adjustPlayerAttributes(team1, goalsTeam1 >= goalsTeam2 ? randomFactors[2] : -randomFactors[3])
  adjustPlayerAttributes(team2, goalsTeam2 >= goalsTeam1 ? randomFactors[3] : -randomFactors[2])
  console.log("Player attributes adjusted based on match results.")

  return { goalsTeam1, goalsTeam2, team1, team2 }
}

function adjustPlayerAttributes(team, outcomeFactor) {
  team.forEach((player) => {
    const changeFactor = 0.01 * outcomeFactor // Change factor based on the outcome
    player.Attack += player.Attack * changeFactor
    player.Midfield += player.Midfield * changeFactor
    player.Defense += player.Defense * changeFactor
    player.Goalkeeping += player.Goalkeeping * changeFactor
  })
}

function encodeMatchResult(matchResult) {
  // Define byte encoding scheme
  const encodingScheme = {
    goalsTeam1: { bytes: 2, type: "uint16" },
    goalsTeam2: { bytes: 2, type: "uint16" },
    team1: { bytes: matchResult.team1.length * 20, type: "string" },
    team2: { bytes: matchResult.team2.length * 20, type: "string" },
  }

  // Encode goalsTeam1 and goalsTeam2 using a custom function that returns a Buffer directly
  const goalsTeam1Bytes = Buffer.from(Functions.encodeUint256(matchResult.goalsTeam1))
  const goalsTeam2Bytes = Buffer.from(Functions.encodeUint256(matchResult.goalsTeam2))

  // Encode team1 and team2 and ensure each player encoding is converted to a Buffer
  const team1Bytes = Buffer.concat(
    matchResult.team1.map((player) => Buffer.from(Functions.encodeString(JSON.stringify(player), "utf8")))
  )
  const team2Bytes = Buffer.concat(
    matchResult.team2.map((player) => Buffer.from(Functions.encodeString(JSON.stringify(player), "utf8")))
  )

  // Concatenate bytes
  const encodedBytes = Buffer.concat([goalsTeam1Bytes, goalsTeam2Bytes, team1Bytes, team2Bytes])

  return encodedBytes
}

async function compressBuffer(buffer) {
  try {
    const compressed = await gzipAsync(buffer)
    console.log(`Original size: ${buffer.length}, Compressed size: ${compressed.length}`)
    return compressed
  } catch (error) {
    console.error("Compression error:", error)
    return null
  }
}

// Simulate the match with the provided data
const matchResult = simulateMatch()

console.log(`Goals for Team 1: ${matchResult.goalsTeam1}`)
console.log(`Goals for Team 2: ${matchResult.goalsTeam2}`)
console.log("Updated Team 1 Stats:", matchResult.team1)
console.log("Updated Team 2 Stats:", matchResult.team2)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the consumer smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Return the encoded matchResult as a custom Buffer
// Encode the matchResult object
const encodedMatchResult = encodeMatchResult(matchResult)

compressBuffer(encodedMatchResult).then((compressedResult) => {
  if (compressedResult) {
    console.log("Compression successful")
    // Log the size of the encodedMatchResult buffer in bytes
    console.log(`The size of the encodedMatchResult buffer is: ${compressedResult.length} bytes`)
    console.log(compressedResult)
    return compressedResult
  }
})
