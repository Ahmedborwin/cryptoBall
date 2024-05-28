const fs = require("fs")
const { ethers } = require("hardhat")

const CONSUMER_ADDRESS_FILE = "src/config/consumer_AddressList.json"
const MANAGER_ADDRESS_FILE = "src/config/Manager_AddressList.json"
const NFT_ADDRESS_FILE = "src/config/NFT_AddressList.json"
const VRF_ADDRESS_FILE = "src/config/VRF_AddressList.json"
const TOKEN_ADDRESS_FILE = "src/config/token_AddressList.json"

const CONSUMER_ABI_FILE = "src/config/consumerAbi.json"
const MANAGER_ABI_FILE = "src/config/managerAbi.json"
const NFT_ABI_FILE = "src/config/NFTAbi.json"
const VRF_ABI_FILE = "src/config/VRFAbi.json"
const TOKEN_ABI_FILE = "src/config/tokenAbi.json"

module.exports = async ({
  chainFunctionsConsumerAddress,
  NFTAddress,
  VRFHandlerAddress,
  gameManagerAddress,
  tokenContractAddress,
}) => {
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
  if (VRFHandlerAddress) {
    console.log("--------VRF Update Address and ABI--------")
    await updateVRFAddress(chainId, VRFHandlerAddress)
    await updateVRFABI(VRFHandlerAddress)
  }
  if (gameManagerAddress) {
    console.log("--------Game Manager Update Address and ABI--------")
    await updateManagerAddress(chainId, gameManagerAddress)
    await updateManagerABI(gameManagerAddress)
  }
  if (tokenContractAddress) {
    console.log("--------Token Update Address and ABI--------")
    await updateTokenAddress(chainId, tokenContractAddress)
    await updateTokenABI(tokenContractAddress)
  }
}
async function updateTokenAddress(chainId, tokenContractAddress) {
  //get contract

  const tokenAddressList = JSON.parse(fs.readFileSync(TOKEN_ADDRESS_FILE, "utf8"))

  if (chainId in tokenAddressList) {
    if (!tokenAddressList[chainId].includes(tokenContractAddress)) {
      tokenAddressList[chainId] = tokenContractAddress
    }
  } else {
    tokenAddressList[chainId] = tokenContractAddress
  }
  fs.writeFileSync(TOKEN_ADDRESS_FILE, JSON.stringify(tokenAddressList, null, 2))
}

async function updateTokenABI(tokenContractAddress) {
  const TokenContract = await ethers.getContractAt("CBToken", tokenContractAddress)
  fs.writeFileSync(TOKEN_ABI_FILE, TokenContract.interface.format(ethers.utils.FormatTypes.json))
}

async function updateManagerAddress(chainId, gameManagerAddress) {
  //get contract

  const managerAddressList = JSON.parse(fs.readFileSync(MANAGER_ADDRESS_FILE, "utf8"))

  if (chainId in managerAddressList) {
    if (!managerAddressList[chainId].includes(gameManagerAddress)) {
      managerAddressList[chainId] = gameManagerAddress
    }
  } else {
    managerAddressList[chainId] = gameManagerAddress
  }
  fs.writeFileSync(MANAGER_ADDRESS_FILE, JSON.stringify(managerAddressList, null, 2))
}

async function updateManagerABI(gameManagerAddress) {
  const GameManager = await ethers.getContractAt("MatchManager", gameManagerAddress)
  fs.writeFileSync(MANAGER_ABI_FILE, GameManager.interface.format(ethers.utils.FormatTypes.json))
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

async function updateVRFAddress(chainId, VRFAddress) {
  //get contract
  const VRFAddressList = JSON.parse(fs.readFileSync(VRF_ADDRESS_FILE, "utf8"))
  if (chainId in VRFAddressList) {
    if (!VRFAddressList[chainId].includes(VRFAddress)) {
      VRFAddressList[chainId] = VRFAddress
    }
  } else {
    VRFAddressList[chainId] = VRFAddress
  }
  fs.writeFileSync(VRF_ADDRESS_FILE, JSON.stringify(VRFAddressList, null, 2))
}

async function updateVRFABI(VRFAddress) {
  const VRFContract = await ethers.getContractAt("VRFRequestHandler", VRFAddress)
  fs.writeFileSync(VRF_ABI_FILE, VRFContract.interface.format(ethers.utils.FormatTypes.json))
}
