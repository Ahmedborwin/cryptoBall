const { Buffer } = await import("node:buffer")
const { promisify } = await import("node:util")
const ethers = await import("npm:ethers@6.10.0")
const crypto = await import("node:crypto")

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

const game = await gameManager.getGameDetails(args[0])

//-------------------------------------------------------------
//Build Array of tokenIds for Both Teams
const Team1Roster = game[2]
const team1Ids = Team1Roster?.map((subArray) => parseInt(subArray[0]))

const Team2Roster = game[4]
const team2Ids = Team2Roster?.map((subArray) => parseInt(subArray[0]))

//-------------------------------------------------------------
//Need Player URI Index before calling IPFS

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

  for (let i = 0; i < teamIds.length; i++) {
    team.push(data[teamIds[i].toString()])
  }
}

// Define the base URL for the IPFS gateway
const gatewayBaseUrl = "https://gateway.pinata.cloud/ipfs/QmYDmg62hTnibmAvAeWkDgtvcbQtgNE2KHhJt2ci8UuW6d"

// Build both teams
await buildTeam(team1Ids, gatewayBaseUrl, team1)
console.log(team1)

await buildTeam(team2Ids, gatewayBaseUrl, team2)

//-------------------------------------------------------------

// Parsing player data into arrays of values

const randomFactors = args.slice(1, 9).map(Number)

let counter = 0

function getRandomNumber(max) {
  return crypto.randomInt(max)
}

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

  const homeTeam = getRandomNumber(2)

  const team1Skill = team1Attack + team1Defense + team1Midfield

  // Compute initial goals
  let team1Goals = computeScoreFromChance(team1Skill, getRandomNumber(3000)) * shotsToGoalsRatio

  // Compute goals saved by the goalkeeper
  const team2Saves = team1Goals * (team2GkSkill / 999) * eliteGoalSavePercentage

  // Adjust goals after saves
  team1Goals = team1Goals - team2Saves

  const team2Skill = team2Attack + team2Defense + team2Midfield
  let team2Goals = computeScoreFromChance(team2Skill, getRandomNumber(3000)) * shotsToGoalsRatio

  const team1Saves = team2Goals * (team1GkSkill / 999) * eliteGoalSavePercentage

  team2Goals = team2Goals - team1Saves

  console.table({ "team1 Goals": team1Goals, "team 2 Goals": team2Goals })

  const winner = team1Goals > team2Goals ? 0 : team1Goals < team2Goals ? 1 : 2
  console.log("Winner: Team", winner)

  const playersUpgrades = adjustPlayerAttributes()

  return { winner, team1Goals, team2Goals, playersUpgrades }
}
function computeScoreFromChance(skill, _chance) {
  // Ensure the chance is within the 0-3000 range
  const chance = _chance % 3000

  // Normalize the skill to a 0-1 range (assuming max skill is 4356)
  const normalizedSkill = skill / 4356

  // Normalize the chance to a 0-1 range
  const normalizedChance = chance / 3000

  // Calculate the raw score using a sigmoid function for smooth scaling
  const score = 10 / (1 + Math.exp(-(normalizedSkill - normalizedChance)))

  // Ensure the score is in the 0-10 range
  return Math.round(score)
}

function adjustPlayerAttributes() {
  //TODO only goalkeeper should have their GK skills increased?

  let playersToUpgrade = []

  const playerUpgraded = getRandomNumber(11)

  for (let i = 0; i < playerUpgraded; i++) {
    const player = getRandomNumber(11)
    const attribute = getRandomNumber(4) + 1
    console.log("attribute", attribute)
    playersToUpgrade.push(player, attribute)
  }

  return playersToUpgrade
}
//Create Custom Buffer
function encodeMatchResult(matchResult) {
  const buffer = Buffer.alloc(256) // Total buffer allocation
  let offset = 0

  buffer.writeUInt32BE(args[0], offset) // gameId
  offset += 4
  buffer.writeUInt8(matchResult.winner, offset) // winner
  offset++
  buffer.writeUInt8(matchResult.team1Goals, offset) // First team score
  offset++
  buffer.writeUInt8(matchResult.team2Goals, offset) // Second team score
  offset++

  for (let i = 0; i < 4; i++) {
    buffer.writeUInt8(matchResult.playersUpgrades[i * 2], offset)
    offset++
    buffer.writeUInt8(matchResult.playersUpgrades[i * 2 + 1], offset)
    offset++
  }
  console.log(buffer)
  console.log(buffer.length)
  return buffer
}

//runs simulate match and returns object of winner, team 2 and 2 score, adjusted team 2 and two metadata
const matchResult = simulateMatch()
//encode match result into custom Bugger
const encodedMatchResult = encodeMatchResult(matchResult)
return encodedMatchResult
