const hre = require("hardhat")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")

const chainId = 421614
const ManagerContractFile = require("../config/Manager_AddressList.json")
const managerAddress = ManagerContractFile[chainId] ? ManagerContractFile[chainId] : address(0)

let gameManagerAddress

async function deployToken(_gameManagerAddress) {
  if (_gameManagerAddress) {
    gameManagerAddress = _gameManagerAddress
  } else {
    gameManagerAddress = managerAddress
  }

  const signer = await hre.ethers.getSigner()

  //deploy token contract
  const cryptoBallToken = await hre.ethers.deployContract("CBToken", [gameManagerAddress])

  //update token address
  //write address and ABI to config
  await updateContractInfo({
    undefined,
    undefined,
    undefined,
    undefined,
    tokenContractAddress: cryptoBallToken.address,
  })

  return { cryptoBallToken, gameManagerAddress }
}

deployToken()
  .then(async (result) => {
    console.log("@@@ Verifying Token Contract")
    //verify contracts
    await hre.run("verify:verify", {
      address: result.cryptoBallToken.address,
      constructorArguments: [gameManagerAddress],
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployToken
