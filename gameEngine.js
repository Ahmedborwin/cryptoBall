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

  const homeBias = 0.25;
  const eliteGoalSavePercentage = .85;
  const shotsToGoalsRatio = 3;


  const homeTeam = randomFactors[0] % 2;

  for (int i = 0; i < 11; i++) {
    team1Attack += team1[i].attack;
    team1Defense += team1[i].defense;
    team1Midfield += team1[i].midfield;
  }
  const team1Skill = team1Attack + team1Defense + team1Midfield
  const team1Goals = computeScoreFromChance(team1Skill)
  team1Goals = team1Goals - ((team1Goals * shotsToGoalsRatio) * (team2GkSkill * eliteGoalSavePercentage))


  for (int i = 0; i < 11; i++) {
    team2Attack += team2[i].attack;
    team2Defense += team2[i].defense;
    team2Midfield += team2[i].midfield;
  }
  const team2Skill = team2Attack + team2Defense + team2Midfield;
  const team2Goals = computeScoreFromChance(team2Skill)
  team2Goals = team2Goals - ((team2Goals * shotsToGoalsRatio) * (team1GkSkill * eliteGoalSavePercentage))

  /*

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
  */
  return { team1Goals, team2Goals, team1, team2 }
}

function computeScoreFromChance(chance) {
    // Ensure the chance is within the 0-10000 range
    if (chance < 0 || chance > 3000) {
      return "Chance must be between 0 and 10000";
    }

    // Convert chance to a probability between 0 and 1
    const probability = chance / 3000;

    // Define the base value for the adjustment
    const base = Math.exp(-3.5);

    // Adjust the computation to ensure the score is scaled from 0 to 10
    // Calculate the score using the inverse of the exponential function adjusted correctly
    // This formula now starts at 0 and increases to 10 as the chance decreases
    const score = (Math.log((1 - probability) * (1 - base) + base) / Math.log(base) * 8);

    // Return the score directly without rounding
    return score + 1;
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
