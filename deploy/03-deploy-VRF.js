const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const NFTContractFile = require("../config/NFT_AddressList.json")
const CONSUMERCONTRACTFILE = require("../config/consumer_AddressList.json")
const GameManagerAddressList = require("../config/Manager_AddressList.json")

/**
 */
const chainId = 421614

const coordinatorAddress = networks[hre.network.name]["vrfCoordinatorV2"]
const gasLane = networks[hre.network.name]["gasLane"]
const callbackGasLimit = networks[hre.network.name]["callbackGasLimit"]
const vrfSubID = networks[hre.network.name]["vrfSubscriptionId"]
const linkToken = networks[hre.network.name]["linkToken"]

const gameManagerAddress = GameManagerAddressList[chainId] ? GameManagerAddressList[chainId] : address(0)
const NFTAddress = NFTContractFile[chainId] ? NFTContractFile[chainId] : address(0)
const consumerAddress = CONSUMERCONTRACTFILE[chainId] ? CONSUMERCONTRACTFILE[chainId] : address(0)

const deployVRFHandler = async function () {
  const signer = await hre.ethers.getSigner()

  //TODO - deploy VRF sub manager contract to fund and add consumer programatically
  // const VRFManager = await hre.ethers.deployContract("VRFv2SubscriptionManager", [])

  // Get the deployed contract to interact with it after deploying.
  const VRFRequestHandler = await hre.ethers.deployContract("VRFRequestHandler", [
    coordinatorAddress,
    vrfSubID,
    gasLane,
    callbackGasLimit,
    NFTAddress,
    signer.address,
    consumerAddress,
    gameManagerAddress,
  ])
  console.log("-----------VRFAddress-------------------")
  console.log(VRFRequestHandler.address)
  console.log("----------------------------------------")

  console.log("-----------update contracts with NEW VRF Address-----------")
  console.log("-----------------------------------------------------------")

  //set VRF address on consumer
  const functionsConsumerContract = await hre.ethers.getContractAt("FunctionsConsumer", consumerAddress)
  await functionsConsumerContract.setVRFHandlerAddress(VRFRequestHandler.address)
  //set VRF address on NFT COntract
  const nftContract = await hre.ethers.getContractAt("CBNFT", NFTAddress)
  await nftContract.setVRFHandlerAddress(VRFRequestHandler.address)
  //set VRF address on Game Manager
  const gameManagerContract = await hre.ethers.getContractAt("MatchManager", gameManagerAddress)
  await gameManagerContract.setVRFHandlerAddress(VRFRequestHandler.address)

  //write address and ABI to config
  await updateContractInfo({ undefined, undefined, VRFHandlerAddress: VRFRequestHandler.address })

  return { signer, VRFRequestHandler }
}

deployVRFHandler()
  .then(async (result) => {
    if (hre.network.name !== "localhost" && hre.network.name !== "localFunctionsTestnet") {
      console.log("-----------Verifying VRF Contract-----------")
      await hre.run("verify:verify", {
        address: result.VRFRequestHandler.address,
        constructorArguments: [
          coordinatorAddress,
          vrfSubID,
          gasLane,
          callbackGasLimit,
          NFTAddress,
          result.signer.address,
          consumerAddress,
          gameManagerAddress,
        ],
      })
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployVRFHandler
