// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config("../.env.enc")

const { networks } = require("../networks")

const { ResponseListener, decodeResult, ReturnType } = require("@chainlink/functions-toolkit")
const { providers } = require("ethers")
const { network } = require("hardhat")

const networkName = network.name
// Example variables - replace these with actual values
const CONSUMER_ADDRESS_FILE = "src/config/chainRunnerAddress.json"
const CONSUMER_ABI_FILE = require("../src/config/chainRunnerAbi.json")

async function EventListeners() {
  const rpcUrl = networks[networkName].url
  if (!rpcUrl) {
    console.error("NO RPC  URL")
  }
  const provider = new hre.ethers.providers.JsonRpcProvider(rpcUrl)
  if (!provider) {
    console.error("NO Provider")
  }
  const consumerAddressList = JSON.parse(fs.readFileSync(CONSUMER_ADDRESS_FILE, "utf8"))

  const consumerABI = CONSUMER_ABI_FILE

  const consumerAddress = consumerAddressList[networks[network.name]["chainId"]]

  // Connect to the contract
  const consumer = new ethers.Contract(chainRunnerAddress, chainRunnerAbi, provider)

  consumer.on("competitionStarted", (arg1, arg2, arg3, arg4, arg5, event) => {
    console.log("-----------------------")
    console.log(`New Event: competitionStarted`)
    console.log(
      `comp started, compid is: ${arg1} , list of athletes: ${arg2}
            )}`
    )
    console.log("-----------------------")
    // Add your event handling logic here
  })

  console.log(`Listening for events...`)
}

EventListeners().catch((e) => {
  console.error(e)
  process.exit = 1
})
