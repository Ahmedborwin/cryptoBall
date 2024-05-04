const fs = require("fs")
const { ethers } = require("hardhat")

const CONSUMER_ADDRESS_FILE = "config/consumer_AddressList.json"

const CONSUMER_ABI_FILE = "config/consumerAbi.json"

module.exports = async (chainFunctionsConsumerAddress) => {
  const chainId = ethers.provider.network.chainId.toString()
  await updateConsumerAddress(chainId, chainFunctionsConsumerAddress)
  await updateChainRunnerABI(chainFunctionsConsumerAddress)
}

async function updateConsumerAddress(chainId, consumerAddress) {
  //get contract

  const chainrunnerAddressList = JSON.parse(fs.readFileSync(CONSUMER_ADDRESS_FILE, "utf8"))

  if (chainId in chainrunnerAddressList) {
    if (!chainrunnerAddressList[chainId].includes(consumerAddress)) {
      chainrunnerAddressList[chainId] = consumerAddress
    }
  } else {
    chainrunnerAddressList[chainId] = consumerAddress
  }
  fs.writeFileSync(CONSUMER_ADDRESS_FILE, JSON.stringify(chainrunnerAddressList, null, 2))
}

async function updateChainRunnerABI(consumerAddress) {
  const FunctionsConsumer = await ethers.getContractAt("FunctionsConsumer", consumerAddress)
  fs.writeFileSync(CONSUMER_ABI_FILE, FunctionsConsumer.interface.format(ethers.utils.FormatTypes.json))
}
