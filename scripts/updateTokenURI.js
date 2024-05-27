const fetch = require("node-fetch")
const { networks } = require("../networks")
const { storeTokenUriMetadata } = require("../scripts/utils/uploadPinata")
const https = require("https")
const NFT_AddressList = require("../src/config/NFT_AddressList.json")
const NFT_ABI = require("../src/config/NFTAbi.json")

const networkName = "localFunctionsTestnet"
const chainId = networks[networkName]["chainId"]

async function fetchNFTMetadata(hre, decodedData) {
  // Replace these values with your actual contract address and ABI
  const NFTAddress = NFT_AddressList[chainId]
  console.log("NFTAddress", NFTAddress)

  // Connect to the Ethereum network
  const signer = await hre.ethers.getSigner()
  // Get the contract instance

  const NFTContract = await hre.ethers.getContractAt("CBNFT", NFTAddress, signer)

  try {
    // Call the contract's tokenURI function to get the IPFS Hash

    const tokenURI = await NFTContract.getTokenUriFromTokenId(2)
    console.log("tokenURI", tokenURI)
    // Extract the IPFS hash from the tokenURI
    const ipfsHash = tokenURI.split("ipfs://")[1]

    const agent = new https.Agent({
      rejectUnauthorized: false, // This disables SSL certificate validation
    })

    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, { agent })
    const metadata = await response.json()
    console.log("metadata", metadata)

    //update metaData to reflect changes to attributes
    const newPlayerMetaData = metadata
    ;(newPlayerMetaData.overall_rating = decodedData.team1[0].overall_rating),
      (newPlayerMetaData.Attack = decodedData.team1[0].overall_rating),
      (newPlayerMetaData.Midfield = decodedData.team1[0].Midfield),
      (newPlayerMetaData.Defense = decodedData.team1[0].Defense),
      (newPlayerMetaData.Goalkeeping = decodedData.team1[0].Goalkeeping)
    //upload to IPFS hash
    const metadataUploadResponse = await storeTokenUriMetadata(newPlayerMetaData)
    const newTokenURI = `ipfs://${metadataUploadResponse.IpfsHash}`

    //update token URI
    await NFTContract.updateTokenURI(1, newTokenURI)
    console.log("Player MetaData Updated")
  } catch (error) {
    console.error("Error fetching NFT metadata:", error)
    return null
  }
}

module.exports = fetchNFTMetadata
