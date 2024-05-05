const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")
const { gzip, ungzip } = await import("node:zlib")
const gzipAsync = promisify(gzip)

// Parsing player data into arrays of values
const team1 = args.slice(0, 11).map((playerJson) => Object.values(JSON.parse(playerJson)))
const team2 = args.slice(11, 22).map((playerJson) => Object.values(JSON.parse(playerJson)))
const randomFactors = args.slice(22, 27).map(Number)

function simulateMatch() {
  console.log("Starting match simulation...")

  let scoreTeam1 =
    team1.reduce((acc, player) => {
      return acc + player[2] + player[3] + player[4] // Assuming Attack, Midfield, Defense are at indexes 2, 3, 4
    }, 0) /
      1000 +
    (randomFactors[0] % 3)
    

  let scoreTeam2 =
    team2.reduce((acc, player) => {
      console.log("Processing player for Team 2:", player[1]) // Assuming player name is at index 1
      return acc + player[2] + player[3] + player[4] // Same assumption for indexes
    }, 0) /
      1000 +
    (randomFactors[1] % 3)

  const goalsTeam1 = Math.round(scoreTeam1)
  const goalsTeam2 = Math.round(scoreTeam2)
  console.log("Goals calculated for both teams.", goalsTeam1, goalsTeam2)

  adjustPlayerAttributes(team1, goalsTeam1 >= goalsTeam2 ? randomFactors[2] : -randomFactors[3])
  adjustPlayerAttributes(team2, goalsTeam2 >= goalsTeam1 ? randomFactors[3] : -randomFactors[2])
  console.log("Player attributes adjusted based on match results.")

  return { goalsTeam1, goalsTeam2, team1, team2 }
}

function adjustPlayerAttributes(team, outcomeFactor) {
  team.forEach((player) => {
    const changeFactor = 0.01 * outcomeFactor // Change factor based on the outcome
    // Apply the change factor and round to the nearest whole number
    player[7] = Math.round(player[7] + player[7] * changeFactor) // Attack
    player[8] = Math.round(player[8] + player[8] * changeFactor) // Midfield
    player[9] = Math.round(player[9] + player[9] * changeFactor) // Defense
    player[10] = Math.round(player[10] + player[10] * changeFactor) // Goalkeeping, assuming it's at index 10
  })
}

function encodeMatchResult(matchResult) {
  // Assume a basic encoding scheme, each value needs to be transformed to a buffer
  const goalsTeam1Bytes = Buffer.from([matchResult.goalsTeam1]) // Simple example
  const goalsTeam2Bytes = Buffer.from([matchResult.goalsTeam2])

  console.log(
    "Team 1 data for Buffer creation:",
    matchResult.team1.map((player) => player)
  )
  console.log(
    "Team 2 data for Buffer creation:",
    matchResult.team2.map((player) => player)
  )

  const team1Bytes = Buffer.concat(
    matchResult.team1.map((player) => {
      return Buffer.from(new Uint8Array(player))
    })
  )
  const team2Bytes = Buffer.concat(
    matchResult.team2.map((player) => {
      return Buffer.from(new Uint8Array(player))
    })
  )

  // Concatenate all bytes
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

// Simulate and encode the match
const matchResult = simulateMatch()
const encodedMatchResult = encodeMatchResult(matchResult)

compressBuffer(encodedMatchResult).then((compressedResult) => {
  if (compressedResult) {
    console.log("Compression successful")
    console.log(`The size of the encodedMatchResult buffer is: ${compressedResult.length} bytes`)
    console.log(compressedResult)
    return compressedResult
  }
})
