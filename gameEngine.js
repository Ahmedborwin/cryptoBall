const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")
const ethers = await import("npm:ethers@6.10.0")

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

//-------------------------------------------------------------
//call smart contract to get gameStruct Data
//-------------------------------------------------------------

const ABI = [
  {
    type: "constructor",
    payable: false,
    inputs: [
      {
        type: "address",
        name: "_CBNFTAddress",
      },
      {
        type: "address",
        name: "_VRFAddress",
      },
      {
        type: "address",
        name: "_consumerAddress",
      },
    ],
  },
  {
    type: "error",
    name: "CBNFT__NotTokenOwner",
    inputs: [],
  },
  {
    type: "event",
    anonymous: false,
    name: "AcceptGame",
    inputs: [
      {
        type: "uint256",
        name: "id",
        indexed: false,
      },
      {
        type: "address",
        name: "challenger",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "CancelGame",
    inputs: [
      {
        type: "uint256",
        name: "id",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "CreateGame",
    inputs: [
      {
        type: "uint256",
        name: "id",
        indexed: false,
      },
      {
        type: "address",
        name: "creator",
        indexed: false,
      },
      {
        type: "uint256",
        name: "creationTime",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "FinalizeGame",
    inputs: [
      {
        type: "uint256",
        name: "id",
        indexed: false,
      },
      {
        type: "address",
        name: "winner",
        indexed: false,
      },
      {
        type: "uint256",
        name: "completionTime",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "StakingProcessFailed",
    inputs: [
      {
        type: "address",
        name: "_player",
        indexed: false,
      },
      {
        type: "bytes",
        name: "Reason",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "StartGame",
    inputs: [
      {
        type: "uint256",
        name: "id",
        indexed: false,
      },
    ],
  },
  {
    type: "function",
    name: "acceptGame",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "_id",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "cancelAllGames",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "cancelGame",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "_id",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "createGame",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "finalizeGame",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "_id",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "games",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "id",
      },
      {
        type: "address",
        name: "creator",
      },
      {
        type: "address",
        name: "challenger",
      },
      {
        type: "address",
        name: "winner",
      },
      {
        type: "uint256",
        name: "creationTime",
      },
      {
        type: "uint256",
        name: "blockAccepted",
      },
      {
        type: "uint256",
        name: "completionTime",
      },
      {
        type: "uint256",
        name: "status",
      },
    ],
  },
  {
    type: "function",
    name: "getGameDetails",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "_gameID",
      },
    ],
    outputs: [
      {
        type: "tuple",
        components: [
          {
            type: "uint256",
            name: "id",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "tuple[]",
            name: "creatorRoster",
            components: [
              {
                type: "uint256",
                name: "tokenID",
              },
              {
                type: "bool",
                name: "active",
              },
              {
                type: "uint8",
                name: "playerPosition",
              },
            ],
          },
          {
            type: "address",
            name: "challenger",
          },
          {
            type: "tuple[]",
            name: "challengerRoster",
            components: [
              {
                type: "uint256",
                name: "tokenID",
              },
              {
                type: "bool",
                name: "active",
              },
              {
                type: "uint8",
                name: "playerPosition",
              },
            ],
          },
          {
            type: "address",
            name: "winner",
          },
          {
            type: "uint256",
            name: "creationTime",
          },
          {
            type: "uint256",
            name: "blockAccepted",
          },
          {
            type: "uint256",
            name: "completionTime",
          },
          {
            type: "uint256",
            name: "status",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "i_Consumer",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "i_NFT",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "i_VRF",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "owner",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "requestRandomNumbers",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "_id",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "rosters",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
      },
      {
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "tokenID",
      },
      {
        type: "bool",
        name: "active",
      },
      {
        type: "uint8",
        name: "playerPosition",
      },
    ],
  },
  {
    type: "function",
    name: "setNFTAddress",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "_NFTAddress",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setRosterPosition",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "_user",
      },
      {
        type: "uint8",
        name: "_position",
      },
      {
        type: "uint256",
        name: "_tokenID",
      },
      {
        type: "uint8",
        name: "_index",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setVRFHandlerAddress",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "_vrfHandler",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "stats",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "wins",
      },
      {
        type: "uint256",
        name: "losses",
      },
      {
        type: "uint256",
        name: "activeGames",
      },
      {
        type: "uint256",
        name: "totalUserGames",
      },
      {
        type: "uint256",
        name: "totalUserAcceptedGames",
      },
    ],
  },
  {
    type: "function",
    name: "tokenIdStringTable",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
      },
      {
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "totalGames",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
]
const Address = "0xD776437E7e54687693f248C592A370844a0dbB2A"
//Personal Alchemy api
const rpcurl = "https://arb-sepolia.g.alchemy.com/v2/U4KPgXJi3FAILfXVYloxhngoXfSLZnER"

// Chainlink Functions compatible Ethers JSON RPC provider class
// (this is required for making Ethers RPC calls with Chainlink Functions)
class FunctionsJsonRpcProvider extends ethers.JsonRpcProvider {
  constructor(url) {
    super(url)
    this.url = url
  }

  async _send(payload) {
    let resp = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return resp.json()
  }
}

const provider = new FunctionsJsonRpcProvider(rpcurl)

//Initialize contract
const gameManager = new ethers.Contract(Address, ABI, provider)

const game = await gameManager.getGameDetails(1)

//-------------------------------------------------------------
//Build Array of tokenIds for Both Teams
const Team1Roster = game[2]
const team1Ids = Team1Roster?.map((subArray) => parseInt(subArray[0]))
const Team2Roster = game[4]
const team2Ids = Team2Roster?.map((subArray) => parseInt(subArray[0]))

//-------------------------------------------------------------
//build team by reading player details from ipfs
//-------------------------------------------------------------
async function buildTeam(teamIds, gatewayBaseUrl, team) {
  const { data } = await Functions.makeHttpRequest({
    headers: {
      "Content-Type": `application/json`,
    },
    url: `${gatewayBaseUrl}`,
  })

  console.log("teamIds", teamIds)

  for (let i = 0; i < teamIds.length; i++) {
    team.push(data[teamIds[i].toString()])
  }
}

// Define the base URL for the IPFS gateway
const gatewayBaseUrl = "https://gateway.pinata.cloud/ipfs/QmY59zJCpS9ChBWxBau85XpGYSi5zcpixczARXnfrLFm6k"

// Build both teams
await buildTeam(team1Ids, gatewayBaseUrl, team1)
console.log("team1", team1)

await buildTeam(team2Ids, gatewayBaseUrl, team2)
console.log("team2", team2)
//-------------------------------------------------------------

// Parsing player data into arrays of values

const randomFactors = args.slice(1, 9).map(Number)

function simulateMatch() {
  console.log("Starting match simulation...")

  const homeBias = 0.25
  const eliteGoalSavePercentage = 0.85
  const shotsToGoalsRatio = 0.7

  let team1Attack = 0
  let team1Defense = 0
  let team1Midfield = 0
  let team1GkSkill = 0

  let team2Attack = 0
  let team2Defense = 0
  let team2Midfield = 0
  let team2GkSkill = 0

  // Calculate team1 attributes
  team1.forEach((player) => {
    player.attributes.forEach((attr) => {
      switch (attr.name) {
        case "attack":
          team1Attack += parseInt(attr.value)
          break
        case "defense":
          team1Defense += parseInt(attr.value)
          break
        case "midfield":
          team1Midfield += parseInt(attr.value)
          break
        case "goalkeeping":
          if (player.team_position === "GK") {
            team1GkSkill += parseInt(attr.value)
          }
          break
      }
    })
  })

  console.log(
    "Team 1 - Attack:",
    team1Attack,
    "Defense:",
    team1Defense,
    "Midfield:",
    team1Midfield,
    "GK Skill:",
    team1GkSkill
  )

  // Calculate team2 attributes
  team2.forEach((player) => {
    player.attributes.forEach((attr) => {
      switch (attr.name) {
        case "attack":
          team2Attack += parseInt(attr.value)
          break
        case "defense":
          team2Defense += parseInt(attr.value)
          break
        case "midfield":
          team2Midfield += parseInt(attr.value)
          break
        case "goalkeeping":
          if (player.team_position === "GK") {
            team1GkSkill += parseInt(attr.value)
          }
          break
      }
    })
  })

  console.log(
    "Team 2 - Attack:",
    team2Attack,
    "Defense:",
    team2Defense,
    "Midfield:",
    team2Midfield,
    "GK Skill:",
    team2GkSkill
  )

  const homeTeam = randomFactors[0] % 2

  const team1Skill = team1Attack + team1Defense + team1Midfield

  // Compute initial goals
  let team1Goals = computeScoreFromChance(team1Skill, randomFactors[2] % 3000) * shotsToGoalsRatio
  console.log("team1Goals (initial)", team1Goals)

  // Compute goals saved by the goalkeeper
  const team2Saves = team1Goals * (team2GkSkill / 999) * eliteGoalSavePercentage
  console.log("goals saved by team2 GK", team2Saves)

  // Adjust goals after saves
  team1Goals = team1Goals - team2Saves
  console.log("team1Goals (adjusted)", team1Goals)

  const team2Skill = team2Attack + team2Defense + team2Midfield
  let team2Goals = computeScoreFromChance(team2Skill, randomFactors[3] % 3000) * shotsToGoalsRatio
  console.log("team2Goals (initial)", team2Goals)

  const team1Saves = team2Goals * (team1GkSkill / 999) * eliteGoalSavePercentage
  console.log("goals saved by team1 GK", team1Saves)

  team2Goals = team2Goals - team1Saves
  console.log("team2Goals (adjusted)", team2Goals)

  console.table({ "team1 Goals": team1Goals, "team 2 Goals": team2Goals })

  const winner = team1Goals > team2Goals ? 1 : team1Goals < team2Goals ? 2 : "draw"
  console.log("Winner: Team", winner)

  const outcomeFactorTeam1 = winner === 1 ? 2 : -2
  const adjustedTeam1Stats = adjustPlayerAttributes(team1, outcomeFactorTeam1)

  const outcomeFactorTeam2 = winner === 2 ? 2 : -2
  const adjustedTeam2Stats = adjustPlayerAttributes(team2, outcomeFactorTeam2)

  return { winner, team1Goals, team2Goals, adjustedTeam1Stats, adjustedTeam2Stats }
}

function computeScoreFromChance(skill, _chance) {
  // Ensure the chance is within the 0-3000 range
  const chance = _chance % 3000
  console.log("skill", skill)
  console.log("chance", chance)
  // Normalize the skill to a 0-1 range (assuming max skill is 4356)
  const normalizedSkill = skill / 4356

  // Normalize the chance to a 0-1 range
  const normalizedChance = chance / 3000

  console.log("normalizedSkill", normalizedSkill)
  console.log("normalizedChance", normalizedChance)
  // Calculate the raw score using a sigmoid function for smooth scaling
  const score = 10 / (1 + Math.exp(-(normalizedSkill - normalizedChance)))
  console.log("score", score)
  // Ensure the score is in the 0-10 range
  return Math.round(score)
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
const matchResult = simulateMatch(randomFactors)
//encode match result into custom Bugger
const encodedMatchResult = encodeMatchResult(matchResult)
return encodedMatchResult
