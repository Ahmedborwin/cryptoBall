const fs = require("fs")
const { ethers } = require("hardhat")

const CONSUMER_ADDRESS_FILE = "config/consumer_AddressList.json"
const NFT_ADDRESS_FILE = "config/NFT_AddressList.json"

const CONSUMER_ABI_FILE = "config/consumerAbi.json"
const NFT_ABI_FILE = "config/NFTAbi.json"

module.exports = async ({ chainFunctionsConsumerAddress, NFTAddress }) => {
  const chainId = ethers.provider.network.chainId.toString()
  if (chainFunctionsConsumerAddress) {
    console.log("--------Consumer UPDATE Address and ABI--------")
    await updateConsumerAddress(chainId, chainFunctionsConsumerAddress)
    await updateConsumerABI(chainFunctionsConsumerAddress)
  }
  if (NFTAddress) {
    console.log("--------NFT Update Address and ABI--------")
    await updateNFTAddress(chainId, NFTAddress)
    await updateNFTABI(NFTAddress)
  }
}

async function updateConsumerAddress(chainId, consumerAddress) {
  //get contract

  const consumerAddressList = JSON.parse(fs.readFileSync(CONSUMER_ADDRESS_FILE, "utf8"))

  if (chainId in consumerAddressList) {
    if (!consumerAddressList[chainId].includes(consumerAddress)) {
      consumerAddressList[chainId] = consumerAddress
    }
  } else {
    consumerAddressList[chainId] = consumerAddress
  }
  fs.writeFileSync(CONSUMER_ADDRESS_FILE, JSON.stringify(consumerAddressList, null, 2))
}

async function updateConsumerABI(consumerAddress) {
  const FunctionsConsumer = await ethers.getContractAt("FunctionsConsumer", consumerAddress)
  fs.writeFileSync(CONSUMER_ABI_FILE, FunctionsConsumer.interface.format(ethers.utils.FormatTypes.json))
}

async function updateNFTAddress(chainId, NFTAddress) {
  //get contract
  const NFTAddressList = JSON.parse(fs.readFileSync(NFT_ADDRESS_FILE, "utf8"))
  if (chainId in NFTAddressList) {
    if (!NFTAddressList[chainId].includes(NFTAddress)) {
      NFTAddressList[chainId] = NFTAddress
    }
  } else {
    NFTAddressList[chainId] = NFTAddress
  }
  fs.writeFileSync(NFT_ADDRESS_FILE, JSON.stringify(NFTAddressList, null, 2))
}

async function updateNFTABI(NFTAddress) {
  const NFTContract = await ethers.getContractAt("CBNFT", NFTAddress)
  fs.writeFileSync(NFT_ABI_FILE, NFTContract.interface.format(ethers.utils.FormatTypes.json))
}
