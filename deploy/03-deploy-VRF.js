const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const NFTContractFile = require("../config/NFT_AddressList.json")
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployVRFHandler = async function () {
  const signer = await hre.ethers.getSigner()

  const coordinatorAddress = networks[hre.network.name]["vrfCoordinatorV2"]
  console.log("coordinatorAddress", coordinatorAddress)
  const vrfSubID = networks[hre.network.name]["vrfSubscriptionId"]
  console.log("vrfSubID", vrfSubID)
  const gasLane = networks[hre.network.name]["gasLane"]
  console.log("gasLane", gasLane)
  const callbackGasLimit = networks[hre.network.name]["callbackGasLimit"]
  console.log("callbackGasLimit", callbackGasLimit)
  const linkToken = networks[hre.network.name]["linkToken"]

  // const chainId = (await hre.ethers.provider.getNetwork()).chainId.toString()
  const chainId = 421614
  console.log("chainId", chainId)
  const NFTAddress = NFTContractFile[chainId] ? NFTContractFile[chainId] : address(0)
  console.log("NFTAddress", NFTAddress)
  // Get the deployed contract to interact with it after deploying.
  const VRFRequestHandler = await hre.ethers.deployContract("VRFRequestHandler", [
    coordinatorAddress,
    vrfSubID,
    gasLane,
    callbackGasLimit,
    NFTAddress,
    signer.address,
  ])

  console.log("@@VRFHandler Address", VRFRequestHandler.address)

  //write address and ABI to config
  await updateContractInfo(VRFRequestHandler.address)

  return { VRFRequestHandler }
}

deployVRFHandler()
  .then(async (result) => {
    //verify contracts
    await hre.run("verify:verify", {
      address: result.VRFRequestHandler.address,
      constructorArguments: [coordinatorAddress, vrfSubID, gasLane, callbackGasLimit, NFTAddress, signer.address],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployVRFHandler
