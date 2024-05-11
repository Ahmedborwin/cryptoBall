const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const { uploadMetadataAsBatch } = require("../scripts/utils/uploadPinata")

const baseURI = "ipfs://QmPp7Tgav8SwPWufZkGaePziMcDHXXCev6DPtHHrHpKHGG/"
/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNFTContract = async function () {
  const signer = await hre.ethers.getSigner()

  // Get the deployed contract to interact with it after deploying.
  const CBNFT = await hre.ethers.deployContract("CBNFT", [baseURI, signer.address])

  //write address and ABI to config
  await updateContractInfo({ undefined, NFTAddress: CBNFT.address, undefined })

  console.log(await CBNFT.s_CB_BaseURI())

  await CBNFT.minNFT(1, signer.address)
  await CBNFT.minNFT(2, signer.address)
  await CBNFT.minNFT(3, signer.address)
  await CBNFT.minNFT(4, signer.address)
  await CBNFT.minNFT(5, signer.address)

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
