const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
require("@chainlink/env-enc").config("../.env.enc")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")
const { randomInt } = require("crypto")

const chainId = 421614

const GameManagerAddressList = require("../src/config/Manager_AddressList.json")
const VRFContractFile = require("../src/config/VRF_AddressList.json")
const ConsumerContractFile = require("../src/config/consumer_AddressList.json")

const gameManagerAddress = GameManagerAddressList[chainId] ? GameManagerAddressList[chainId] : address(0)
const VRFAddress = VRFContractFile[chainId] ? VRFContractFile[chainId] : address(0)
const ConsumerAddress = ConsumerContractFile[chainId] ? ConsumerContractFile[chainId] : address(0)

const updateContractInfo = require("../scripts/utils/updateAddress&ABI")

const baseURI = "ipfs://QmPp7Tgav8SwPWufZkGaePziMcDHXXCev6DPtHHrHpKHGG/"

/**
 */
const deployNFTContract = async function () {
  const signer = await hre.ethers.getSigner()

  const provider = new hre.ethers.getDefaultProvider()

  // Get the deployed contract to interact with it after deploying.
  const CBNFT = await hre.ethers.deployContract("CBNFT", [baseURI, gameManagerAddress, VRFAddress])
  console.log("-----------NFTAddress-------------------")
  console.log(CBNFT.address)
  console.log("----------------------------------------")
  //write address and ABI to config
  await updateContractInfo({ undefined, NFTAddress: CBNFT.address, undefined })
  console.log("-----------Mint NFTs For Player1-----------")
  console.log("-------------------------------------------")
  await CBNFT.openLootBox(randomInt(31), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)
  await CBNFT.openLootBox(randomInt(706), signer.address)

  const privateKey_2 = process.env.PRIVATE_KEY_2 // fetch PRIVATE KEY of second account }
  const wallet_2 = new hre.ethers.Wallet(privateKey_2)

  const player2 = wallet_2.connect(provider)
  console.log("-----------Mint NFTs For Player2-----------")
  console.log("-------------------------------------------")
  //second player
  await CBNFT.openLootBox(randomInt(31), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)
  await CBNFT.openLootBox(randomInt(706), player2.address)

  console.log("-----------update contracts with NEW NFT Address-----------")
  console.log("-----------------------------------------------------------")
  //set NFT address on VRF
  const vrfContract = await hre.ethers.getContractAt("VRFRequestHandler", VRFAddress)
  console.log("VRF Contract Address:", vrfContract.address)
  await vrfContract.setNFTAddress(CBNFT.address)
  //set NFT address on Game Manager Contract
  const matchManagerContract = await hre.ethers.getContractAt("MatchManager", gameManagerAddress)
  console.log("Game Manager Contract Address:", matchManagerContract.address)
  await matchManagerContract.setNFTAddress(CBNFT.address)
  return { CBNFT, signer }
}

deployNFTContract()
  .then(async (result) => {
    if (hre.network.name !== "localhost" && hre.network.name !== "localFunctionsTestnet") {
      console.log("-----------Verifying NFT Contract-----------")
      await hre.run("verify:verify", {
        address: result.CBNFT.address,
        constructorArguments: [baseURI, gameManagerAddress, VRFAddress],
      })
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployNFTContract
