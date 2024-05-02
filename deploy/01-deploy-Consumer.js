const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")
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

  // Get the deployed contract to interact with it after deploying.
  const functionsConsumer = await hre.ethers.deployContract("FunctionsConsumer", [functionsRouterAddress, donIdBytes32])

  console.log(functionsConsumer.address)
}

module.exports = FunctionsConsumerContract

FunctionsConsumerContract().catch((e) => {
  console.error(e)
  process.exit(1)
})
