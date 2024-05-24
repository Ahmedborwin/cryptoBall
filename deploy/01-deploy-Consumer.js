const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")

const updateContractInfo = require("../scripts/utils/updateAddress&ABI")

const chainId = 421614

const GameManagerAddressList = require("../config/Manager_AddressList.json")
const VRFContractFile = require("../config/VRF_AddressList.json")

const gameManagerAddress = GameManagerAddressList[chainId] ? GameManagerAddressList[chainId] : address(0)
const VRFAddress = VRFContractFile[chainId] ? VRFContractFile[chainId] : address(0)

const functionsRouterAddress = networks[hre.network.name]["functionsRouter"]
const donIdBytes32 = hre.ethers.utils.formatBytes32String(networks[hre.network.name]["donId"])
const subId = networks[hre.network.name]["subscriptionId"]
const callbackGasLimit = 300000

const FunctionsConsumerContract = async function () {
  const signer = await hre.ethers.getSigner()
  // Get the deployed contract to interact with it after deploying.
  const functionsConsumer = await hre.ethers.deployContract("FunctionsConsumer", [
    functionsRouterAddress,
    donIdBytes32,
    gameManagerAddress,
    VRFAddress,
    signer.address,
  ])

  console.log(functionsConsumer.address)

  //populate js script for gameEngine
  await functionsConsumer.populateGameEngine(fs.readFileSync("gameEngine.js").toString())

  //write address and ABI to config
  await updateContractInfo({
    chainFunctionsConsumerAddress: functionsConsumer.address,
    undefined,
    undefined,
    undefined,
  })

  //populate subID and gaslimit
  await functionsConsumer.populateSubIdANDGasLimit(subId, callbackGasLimit)
  //add consumer to subscription
  await hre.run("functions-sub-add", {
    subid: subId.toString(),
    contract: functionsConsumer.address.toString(),
  })

  //set Consumer address on VRF
  const vrfContract = await hre.ethers.getContractAt("vrfContract", VRFAddress)
  console.log("functionsConsumer Address:", vrfContract.address)
  await vrfContract.setFunctionsConsumerAddress(functionsConsumer.address)

  //set Consumer address on Game Manager
  const gameManagerContract = await hre.ethers.getContractAt("MatchManager", gameManagerAddress)
  console.log("Game Manager Contract Address:", gameManagerContract.address)
  await gameManagerContract.setFunctionsConsumerAddress(functionsConsumer.address)

  return {
    functionsConsumer,
    functionsRouterAddress,
    donIdBytes32,
    signer,
  }
}

FunctionsConsumerContract()
  .then(async (result) => {
    //verify contracts
    await hre.run("verify:verify", {
      address: result.functionsConsumer.address,
      constructorArguments: [
        result.functionsRouterAddress,
        result.donIdBytes32,
        gameManagerAddress,
        VRFAddress,
        result.signer.address,
      ],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = FunctionsConsumerContract
