const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")
const { gzip, ungzip } = await import("node:zlib")
const gzipAsync = promisify(gzip)

//Declare Variables
let team1Attack
let team1Defense
let team1Midfield
let team1GkSkill

let team2Attack
let team2Defense
let team2Midfield
let team2GkSkill

// Parsing player data into arrays of values
// TODO: read the players metadata from ipfs. Expect token IDs and smart contract address?
const team1 = args.slice(0, 11).map((playerJson) => Object.values(JSON.parse(playerJson)))
const team2 = args.slice(11, 22).map((playerJson) => Object.values(JSON.parse(playerJson)))
const randomFactors = args.slice(22, 27).map(Number)

function simulateMatch() {
  console.log("Starting match simulation...")

  const homeBias = 0.25
  const eliteGoalSavePercentage = 0.85
  const shotsToGoalsRatio = 3
  //TO DO - should be passed as argument and alternate between the two teams
  const homeTeam = randomFactors[0] % 2

  for (let i = 0; i < 11; i++) {
    team1Attack += team1[i].attack
    team1Defense += team1[i].defense
    team1Midfield += team1[i].midfield
  }
  const team1Skill = team1Attack + team1Defense + team1Midfield
  let team1Goals = computeScoreFromChance(team1Skill)
  team1Goals = team1Goals - team1Goals * shotsToGoalsRatio * (team2GkSkill * eliteGoalSavePercentage)

  for (let i = 0; i < 11; i++) {
    team2Attack += team2[i].attack
    team2Defense += team2[i].defense
    team2Midfield += team2[i].midfield
  }
  const team2Skill = team2Attack + team2Defense + team2Midfield
  let team2Goals = computeScoreFromChance(team2Skill)
  team2Goals = team2Goals - team2Goals * shotsToGoalsRatio * (team1GkSkill * eliteGoalSavePercentage)

  //Hardcoded for now. Match simulaiton is not working.
  return { team1Goals: 1, team2Goals: 2, team1, team2 }
}

function computeScoreFromChance(chance) {
  // Ensure the chance is within the 0-10000 range
  if (chance < 0 || chance > 3000) {
    return "Chance must be between 0 and 10000"
  }

  // Convert chance to a probability between 0 and 1
  const probability = chance / 3000

  // Define the base value for the adjustment
  const base = Math.exp(-3.5)

  // Adjust the computation to ensure the score is scaled from 0 to 10
  // Calculate the score using the inverse of the exponential function adjusted correctly
  // This formula now starts at 0 and increases to 10 as the chance decreases
  const score = (Math.log((1 - probability) * (1 - base) + base) / Math.log(base)) * 8

  // Return the score directly without rounding
  return score + 1
}

function adjustPlayerAttributes(team, outcomeFactor) {
  team.forEach((player) => {
    const changeFactor = 0.01 * outcomeFactor // Change factor based on the outcome
    // Apply the change factor and round to the nearest whole number
    if (player[3] == "Goalkeeper") {
      player[10] = Math.round(player[10] + player[10] * changeFactor) // Goalkeeping, assuming it's at index 10
    } else {
      player[7] = Math.round(player[7] + player[7] * changeFactor) // Attack
      player[8] = Math.round(player[8] + player[8] * changeFactor) // Midfield
      player[9] = Math.round(player[9] + player[9] * changeFactor) // Defense
    }
  })
}

function encodeMatchResult(matchResult) {
  const buffer = Buffer.alloc(256) // Total buffer allocation
  buffer.writeUInt8(matchResult.team1Goals, 0) // First team score

  buffer.writeUInt8(matchResult.team2Goals, 1) // Second team score

  let offset = 2
  const encodeTeamData = (team) => {
    team.forEach((player) => {
      buffer.writeUInt32BE(player[0], offset) // Player ID (6 bytes)
      offset += 6
      buffer.writeUInt8(player[3], offset++) // Overall rating (1 byte)
      buffer.writeUInt8(player[6], offset++) // Attack rating (1 byte)
      buffer.writeUInt8(player[7], offset++) // Midfield rating (1 byte)
      buffer.writeUInt8(player[8], offset++) // Defense rating (1 byte)
      buffer.writeUInt8(player[9], offset++) // Goalkeeping rating (1 byte)
    })
  }
  encodeTeamData(matchResult.team1)
  encodeTeamData(matchResult.team2)
  return buffer
}

const matchResult = simulateMatch()
const encodedMatchResult = encodeMatchResult(matchResult)
return encodedMatchResult

// async function compressBuffer(buffer) {
//   try {
//     const compressed = await gzipAsync(buffer)
//     console.log(`Original size: ${buffer.length}, Compressed size: ${compressed.length}`)
//     return compressed
//   } catch (error) {
//     console.error("Compression error:", error)
//     return null
//   }
// }

// Simulate and encode the match

// compressBuffer(encodedMatchResult).then((compressedResult) => {
//   if (compressedResult) {
//     console.log("Compression successful")
//     console.log(`The size of the encodedMatchResult buffer is: ${compressedResult.length} bytes`)
//     console.log(compressedResult)
//     return compressedResult
//   }
// })
