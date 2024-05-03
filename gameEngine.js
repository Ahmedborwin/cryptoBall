//Test Game engine mechanics
//expects meta data for 11 players for each team and an array of random nummbers to be

// Assuming arguments contains 22 player names followed by 5 random integers

// Parsing player data into objects
const team1 = args.slice(0, 11).map((playerJson) => JSON.parse(playerJson))
const team2 = args.slice(11, 22).map((playerJson) => JSON.parse(playerJson))
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
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeUint256(Math.round(totalAmountAfterInterest))
