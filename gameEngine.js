const { Buffer } = import("node:buffer")
const { promisify } = import("node:util")

// Parsing player data into arrays of values
//const team1 = args.slice(0, 11).map((playerJson) => Object.values(JSON.parse(playerJson)))
//const team2 = args.slice(11, 22).map((playerJson) => Object.values(JSON.parse(playerJson)))
//const randomFactors = args.slice(22, 30).map(Number)

const team1 = [
  {
    attack: 75,
    defense: 13,
    midfield: 24,
    gkskill: 88,
  },
  {
    attack: 60,
    defense: 21,
    midfield: 35,
    gkskill: 44,
  },
  {
    attack: 92,
    defense: 58,
    midfield: 70,
    gkskill: 30,
  },
  {
    attack: 18,
    defense: 73,
    midfield: 41,
    gkskill: 54,
  },
  {
    attack: 33,
    defense: 49,
    midfield: 85,
    gkskill: 2,
  },
  {
    attack: 97,
    defense: 14,
    midfield: 62,
    gkskill: 26,
  },
  {
    attack: 47,
    defense: 68,
    midfield: 19,
    gkskill: 79,
  },
  {
    attack: 81,
    defense: 7,
    midfield: 55,
    gkskill: 90,
  },
  {
    attack: 23,
    defense: 92,
    midfield: 12,
    gkskill: 65,
  },
  {
    attack: 88,
    defense: 38,
    midfield: 76,
    gkskill: 99,
  },
  {
    attack: 45,
    defense: 59,
    midfield: 6,
    gkskill: 70,
  },
]

const team2 = [
  {
    attack: 72,
    defense: 15,
    midfield: 82,
    gkskill: 33,
  },
  {
    attack: 49,
    defense: 93,
    midfield: 64,
    gkskill: 11,
  },
  {
    attack: 31,
    defense: 84,
    midfield: 27,
    gkskill: 40,
  },
  {
    attack: 91,
    defense: 26,
    midfield: 51,
    gkskill: 98,
  },
  {
    attack: 68,
    defense: 2,
    midfield: 78,
    gkskill: 57,
  },
  {
    attack: 87,
    defense: 45,
    midfield: 13,
    gkskill: 85,
  },
  {
    attack: 20,
    defense: 97,
    midfield: 44,
    gkskill: 73,
  },
  {
    attack: 10,
    defense: 50,
    midfield: 66,
    gkskill: 61,
  },
  {
    attack: 54,
    defense: 36,
    midfield: 7,
    gkskill: 29,
  },
  {
    attack: 95,
    defense: 4,
    midfield: 67,
    gkskill: 89,
  },
  {
    attack: 65,
    defense: 32,
    midfield: 99,
    gkskill: 16,
  },
]

let randomFactors = []
for (let i = 0; i < 9; i++) {
  randomFactors[i] = getRandomInt(9999999)
}

console.log(randomFactors)

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
    team1Attack += team1[i].attack
    team1Defense += team1[i].defense
    team1Midfield += team1[i].midfield
    team1GkSkill += team1[i].gkskill
    console.log(team1Attack, team1Defense, team1Midfield, team1GkSkill)
  }
  const team1Skill = team1Attack + team1Defense + team1Midfield
  let team1Goals = computeScoreFromChance(team1Skill, randomFactors[2] % 3000) * shotsToGoalsRatio
  team1Goals = team1Goals - team1Goals * (team2GkSkill * eliteGoalSavePercentage)

  for (let i = 0; i < 11; i++) {
    team2Attack += team2[i].attack
    team2Defense += team2[i].defense
    team2Midfield += team2[i].midfield
    team2GkSkill += team1[i].gkskill
    console.log(team2Attack, team2Defense, team2Midfield, team2GkSkill)
  }
  const team2Skill = team2Attack + team2Defense + team2Midfield
  let team2Goals = computeScoreFromChance(team2Skill, randomFactors[3] % 3000) * shotsToGoalsRatio
  team2Goals = team2Goals - team2Goals * (team1GkSkill * eliteGoalSavePercentage)

  const winner = team1Goals < team2Goals ? 0 : 1
  console.log(winner)
  return { winner, team1Goals, team2Goals }
}

function computeScoreFromChance(skill, chance) {
  // Ensure the chance is within the 0-10000 range
  if (chance < 0 || chance > 3000) {
    return "Chance must be between 0 and 10000"
  }

  // Convert chance to a probability between 0 and 1
  const chanceBias = 0.25
  const probability = (chance * chanceBias * skill) / 2 / 3000

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
  const team1PlayerToChange = randomFactors[3] % 11
  const team1PlayerID = team1[team1PlayerToChange].id
  const team1Attribute = randomFactors[4] % 4

  const team2PlayerToChange = randomFactors[5] % 11
  const team2PlayerID = team2[team2PlayerToChange].id
  const team2Attribute = randomFactors[6] % 4

  const winningTeam = //;
    console.log(team1PlayerID, team1Attribute, team2PlayerID, team2Attribute)
  return { team1PlayerID, team1Attribute, team2PlayerID, team2Attribute }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Simulate and encode the match
const matchResult = simulateMatch()
//const encodedMatchResult = encodeMatchResult(matchResult)
