const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const NFTContractFile = require("../config/NFT_AddressList.json")
const VRFContractFile = require("../config/VRF_AddressList.json")
const ConsumerContractFile = require("../config/consumer_AddressList.json")

//----------------variables---------------------//

const chainId = 421614
const NFTAddress = NFTContractFile[chainId] ? NFTContractFile[chainId] : address(0)
const VRFAddress = VRFContractFile[chainId] ? VRFContractFile[chainId] : address(0)
const ConsumerAddress = ConsumerContractFile[chainId] ? ConsumerContractFile[chainId] : address(0)

//----------------Deploy Function---------------------//
const deployManager = async function () {
  const [signer, player2] = await hre.ethers.getSigners()
  console.log(signer.address)
  console.log(player2.address)

  //deploy VRF sub manager contract to fund and add consumer programatically
  const gameManager = await hre.ethers.deployContract("MatchManager", [NFTAddress, VRFAddress, ConsumerAddress])
  console.log("@@@gameManager", gameManager.address)
  //register Managers
  await gameManager.registerNewManager("blueTeam")
  await gameManager.connect(player2).registerNewManager("redTeam")
  console.log("managers registered")
  //fill creator Roster
  for (let i = 12; i < 23; i++) {
    await gameManager.connect(player2).setRosterPosition(player2.address, 2, i, 99)
    console.log("Counter:", i)
  }
  for (let i = 1; i < 12; i++) {
    await gameManager.setRosterPosition(signer.address, 2, i, 99)
    console.log("Counter:", i)
  }

  //write address and ABI to config
  await updateContractInfo({ undefined, undefined, undefined, gameManagerAddress: gameManager.address })

  //set GameManager address on consumer
  const functionsConsumerContract = await hre.ethers.getContractAt("FunctionsConsumer", ConsumerAddress)
  console.log("functionsConsumer Address:", functionsConsumerContract.address)
  await functionsConsumerContract.setMatchManagerAddress(gameManager.address)
  //set game manager address on VRF
  const vrfContract = await hre.ethers.getContractAt("VRFRequestHandler", VRFAddress)
  console.log("VRF Contract Address:", vrfContract.address)
  await vrfContract.setMatchManagerAddress(gameManager.address)
  //set game manager address on NFT COntract
  const nftContract = await hre.ethers.getContractAt("CBNFT", NFTAddress)
  console.log("NFT Contract Address:", nftContract.address)
  await nftContract.setMatchManager(gameManager.address)

  //Create Game
  const gameId = await gameManager.createGame()
  console.log("Game Created")
  // //accept Game
  // await gameManager.connect(player2).acceptGame(gameId)

  return { signer, gameManager }
}

deployManager()
  .then(async (result) => {
    console.log("@@@ Verifying Contract")
    //verify contracts
    await hre.run("verify:verify", {
      address: result.gameManager.address,
      constructorArguments: [NFTAddress, VRFAddress, ConsumerAddress],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployManager
