const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const NFTContractFile = require("../config/NFT_AddressList.json")
const CONSUMERCONTRACTFILE = require("../config/consumer_AddressList.json")
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 *
 */
console.log("NetworkName: ", hre.network.name)
const coordinatorAddress = networks[hre.network.name]["vrfCoordinatorV2"]
console.log("coordinatorAddress", coordinatorAddress)
const vrfSubID = networks[hre.network.name]["vrfSubscriptionId"]
console.log("vrfSubID", vrfSubID)
const gasLane = networks[hre.network.name]["gasLane"]
console.log("gasLane", gasLane)
const callbackGasLimit = networks[hre.network.name]["callbackGasLimit"]
console.log("callbackGasLimit", callbackGasLimit)
const linkToken = networks[hre.network.name]["linkToken"]
//const chainId = (await hre.ethers.provider.getNetwork()).chainId.toString()
const chainId = 421614

const NFTAddress = NFTContractFile[chainId] ? NFTContractFile[chainId] : address(0)
console.log("NFTAddress", NFTAddress)
const consumerAddress = CONSUMERCONTRACTFILE[chainId] ? CONSUMERCONTRACTFILE[chainId] : address(0)
console.log("consumerAddress", consumerAddress)

const deployVRFHandler = async function () {
  const signer = await hre.ethers.getSigner()

  // //deploy VRF sub manager contract to fund and add consumer programatically
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
  ])

  //write address and ABI to config
  await updateContractInfo({ undefined, undefined, VRFHandlerAddress: VRFRequestHandler.address })

  // await requestRandomNumber(1, "0x5f2AF68dF96F3e58e1a243F4f83aD4f5D0Ca6029", 1, 1)

  return { signer, VRFRequestHandler }
}

deployVRFHandler()
  .then(async (result) => {
    //verify contracts
    await hre.run("verify:verify", {
      address: result.VRFRequestHandler.address,
      constructorArguments: [
        coordinatorAddress,
        vrfSubID,
        gasLane,
        callbackGasLimit,
        NFTAddress,
        result.signer.address,
      ],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployVRFHandler
