const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
require("@chainlink/env-enc").config("../.env.enc")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")

const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const baseURI = "ipfs://QmPp7Tgav8SwPWufZkGaePziMcDHXXCev6DPtHHrHpKHGG/"
/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNFTContract = async function () {
  const signer = await hre.ethers.getSigner()

  const provider = new hre.ethers.getDefaultProvider()

  // Get the deployed contract to interact with it after deploying.
  const CBNFT = await hre.ethers.deployContract("CBNFT", [baseURI, signer.address])

  //write address and ABI to config
  await updateContractInfo({ undefined, NFTAddress: CBNFT.address, undefined })

  await CBNFT.minNFT(1, signer.address)
  await CBNFT.minNFT(2, signer.address)
  await CBNFT.minNFT(3, signer.address)
  await CBNFT.minNFT(4, signer.address)
  await CBNFT.minNFT(5, signer.address)
  await CBNFT.minNFT(6, signer.address)
  await CBNFT.minNFT(7, signer.address)
  await CBNFT.minNFT(8, signer.address)
  await CBNFT.minNFT(9, signer.address)
  await CBNFT.minNFT(10, signer.address)
  await CBNFT.minNFT(11, signer.address)

  const privateKey_2 = process.env.PRIVATE_KEY_2 // fetch PRIVATE KEY of second account }
  const wallet_2 = new hre.ethers.Wallet(privateKey_2)

  const player2 = wallet_2.connect(provider)

  //second player
  await CBNFT.minNFT(12, player2.address)
  await CBNFT.minNFT(13, player2.address)
  await CBNFT.minNFT(14, player2.address)
  await CBNFT.minNFT(15, player2.address)
  await CBNFT.minNFT(16, player2.address)
  await CBNFT.minNFT(17, player2.address)
  await CBNFT.minNFT(18, player2.address)
  await CBNFT.minNFT(19, player2.address)
  await CBNFT.minNFT(20, player2.address)
  await CBNFT.minNFT(21, player2.address)
  await CBNFT.minNFT(22, player2.address)

  return { CBNFT, signer }
}

deployNFTContract()
  .then(async (result) => {
    if (hre.network.name !== "localhost" && hre.network.name !== "localFunctionsTestnet") {
      await hre.run("verify:verify", {
        address: result.CBNFT.address,
        constructorArguments: [baseURI, result.signer.address],
      })
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployNFTContract
