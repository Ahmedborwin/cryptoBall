const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")

//Declare Variables

let team1 = []
let team2 = []

let team1Attack
let team1Defense
let team1Midfield
let team1GkSkill

let team2Attack
let team2Defense
let team2Midfield
let team2GkSkill

const team1Args = args.slice(0, 11)
const team2Args = args.slice(12, 22)

//build team by reading player details from ipfs
async function buildTeams() {
  const promises = team1Args.map((hash, index) => {
    return Functions.makeHttpRequest({
      headers: {
        "Content-Type": "application/json",
      },
      url: hash,
      method: "GET", // Optional
    })
      .then((response) => {
        team1.push(response.data)
        console.log(`Player ${index + 1} data:`, response.data)
      })
      .catch((error) => {
        console.error(`Error fetching data for player ${index + 1}:`, error.message)
      })
  })

  await Promise.all(promises)
  console.log("Final Team 1 Data:", team1)
}

// Call the function
buildTeams()

// Parsing player data into arrays of values

team1 = args.slice(0, 11).map((playerJson) => Object.values(JSON.parse(playerJson)))
team2 = args.slice(11, 22).map((playerJson) => Object.values(JSON.parse(playerJson)))
const randomFactors = args.slice(22, 27).map(Number)

function simulateMatch() {
  console.log("Starting match simulation...")

  const homeBias = 0.25
  const eliteGoalSavePercentage = 0.85
  const shotsToGoalsRatio = 7

  let team1Attack = 0
  let team1Defense = 0
  let team1Midfield = 0
  let team1GkSkill = 0

  let team2Attack = 0
  let team2Defense = 0
  let team2Midfield = 0
  let team2GkSkill = 0

  console.log(team1, team2)

  const homeTeam = randomFactors[0] % 2

  for (let i = 0; i < 11; i++) {
    team1Attack += team1[i][6]
    team1Midfield += team1[i][7]
    team1Defense += team1[i][8]
    team1GkSkill += team1[i][9]
    console.log(team1Attack, team1Defense, team1Midfield, team1GkSkill)
  }
  const team1Skill = team1Attack + team1Defense + team1Midfield
  let team1Goals = computeScoreFromChance(team1Skill, randomFactors[2] % 3000) * shotsToGoalsRatio
  team1Goals = team1Goals - team1Goals * (team2GkSkill * eliteGoalSavePercentage)

  for (let i = 0; i < 11; i++) {
    team2Attack += team2[i][6]
    team2Midfield += team2[i][7]
    team2Defense += team2[i][8]
    team2GkSkill += team2[i][9]
    console.log(team2Attack, team2Defense, team2Midfield, team2GkSkill)
  }
  const team2Skill = team2Attack + team2Defense + team2Midfield
  let team2Goals = computeScoreFromChance(team2Skill, randomFactors[3] % 3000) * shotsToGoalsRatio
  team2Goals = team2Goals - team2Goals * (team1GkSkill * eliteGoalSavePercentage)

  const winner = team1Goals < team2Goals ? 2 : 2
  console.log("@@@winner", winner)

  const outcomeFactorTeam1 = winner == 2 ? 2 : -2
  const adjustedTeam1Stats = adjustPlayerAttributes(team1, outcomeFactorTeam1)

  const outcomeFactorTeam2 = winner == 2 ? 2 : -2
  const adjustedTeam2Stats = adjustPlayerAttributes(team2, outcomeFactorTeam2)

  return { winner, team1Goals, team2Goals, adjustedTeam1Stats, adjustedTeam2Stats }
}
function computeScoreFromChance(skill, chance) {
  // Ensure the chance is within the 0-10000 range
  if (chance < 0 || chance > 3000) {
    return "Chance must be between 0 and 10000"
  }

  // Convert chance to a probability between 0 and 2
  const chanceBias = 0.25
  const probability = (chance * chanceBias * skill) / 2 / 3000

  // Define the base value for the adjustment
  const base = Math.exp(-3.5)

  // Adjust the computation to ensure the score is scaled from 0 to 10
  // Calculate the score using the inverse of the exponential function adjusted correctly
  // This formula now starts at 0 and increases to 10 as the chance decreases
  const score = (Math.log((2 - probability) * (2 - base) + base) / Math.log(base)) * 8

  // Return the score directly without rounding
  return score + 2
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
  return team
}
//Create Custom Buffer
function encodeMatchResult(matchResult) {
  const buffer = Buffer.alloc(256) // Total buffer allocation
  buffer.writeUInt8(matchResult.team1Goals, 0) // First team score

  buffer.writeUInt8(matchResult.team2Goals, 2) // Second team score

  let offset = 2
  const encodeTeamData = (team) => {
    team.forEach((player) => {
      buffer.writeUInt32BE(player[0], offset) // Player ID (6 bytes)
      offset += 6
      buffer.writeUInt8(player[3], offset++) // Overall rating (2 byte)
      buffer.writeUInt8(player[6], offset++) // Attack rating (2 byte)
      buffer.writeUInt8(player[7], offset++) // Midfield rating (2 byte)
      buffer.writeUInt8(player[8], offset++) // Defense rating (2 byte)
      buffer.writeUInt8(player[9], offset++) // Goalkeeping rating (2 byte)
    })
  }
  encodeTeamData(matchResult.adjustedTeam1Stats)
  encodeTeamData(matchResult.adjustedTeam2Stats)
  return buffer
}

//runs simulate match and returns object of winner, team 2 and 2 score, adjusted team 2 and two metadata
const matchResult = simulateMatch()
//encode match result into custom Bugger
const encodedMatchResult = encodeMatchResult(matchResult)
return encodedMatchResult
