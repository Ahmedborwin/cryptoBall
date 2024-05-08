const { assert } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { network, ethers } = require("hardhat")

describe("NFT Unit Tests", async function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  this.beforeEach("CryptoBall", async () => {
    ;[deployer, player2, player3, defaultAddress] = await ethers.getSigners()

    //deploy chainrunners contract
    const crytpoBallFactory = await ethers.getContractFactory("CRYPTOBALL")
    //passing dummy address to
    cryptoBall = await crytpoBallFactory.connect(deployer).deploy()
    console.log("cryptoBall", cryptoBall.address)
  })
  describe("initialTests", () => {
    it("createProfile", async () => {
      await cryptoBall.createTeamProfile("RealMadrid")
      const managerProfile = await cryptoBall.managerTable(deployer.address)
      console.log(JSON.stringify(managerProfile))
    })
  })
})
