const { ethers } = require("hardhat")
const hre = require("hardhat")
const { networks } = require("../../networks")
const { network } = require("hardhat")

const consumer_AddressList = require("../../src/config/consumer_AddressList.json")

const networkName = network.name
const chainId = networks[networkName]["chainId"]

// const chainID = (await ethers.provider.getNetwork()).chainId.toString()

async function verifyContracts() {
  const donId = hre.ethers.utils.formatBytes32String(networks[hre.network.name]["donId"])
  const functionsRouter = networks[networkName]["functionsRouter"]

  const consumerAddress = consumer_AddressList[chainId]
  console.log(consumerAddress)

  await hre.run("verify:verify", {
    address: consumerAddress,
    constructorArguments: [functionsRouter, donId],
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
verifyContracts().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

module.exports.verifyContracts = verifyContracts
