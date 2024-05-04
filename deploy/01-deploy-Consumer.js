const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const FunctionsConsumerContract = async function () {
  const signer = await hre.ethers.getSigner()
  const functionsRouterAddress = networks[hre.network.name]["functionsRouter"]
  const donIdBytes32 = hre.ethers.utils.formatBytes32String(networks[hre.network.name]["donId"])
  const subId = networks[hre.network.name]["subscriptionId"]
  // Get the deployed contract to interact with it after deploying.
  const functionsConsumer = await hre.ethers.deployContract("FunctionsConsumer", [functionsRouterAddress, donIdBytes32])

  console.log(functionsConsumer.address)

  //populate js script for gameEngine
  await functionsConsumer.populateGameEngine(fs.readFileSync("gameEngine.js").toString())

  //write address and ABI to config
  await updateContractInfo(functionsConsumer.address)

  //add consumer to subscription
  await hre.run("functions-sub-add", {
    subid: subId.toString(),
    contract: functionsConsumer.address.toString(),
  })
  return { functionsConsumer, functionsRouterAddress, donIdBytes32 }
}

FunctionsConsumerContract()
  .then(async (result) => {
    //verify contracts
    await hre.run("verify:verify", {
      address: result.functionsConsumer.address,
      constructorArguments: [result.functionsRouterAddress, result.donIdBytes32],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = FunctionsConsumerContract
