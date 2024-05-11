const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
require("@chainlink/env-enc").config("../.env.enc")

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

const metadataFolder = path.resolve(__dirname, "../../CB_MetaData")

async function uploadMetadataAsDirectory() {
  try {
    // Use pinFromFS to upload the entire directory
    const result = await pinata.pinFromFS(metadataFolder, {
      pinataMetadata: {
        name: "metadata_directory",
      },
      pinataOptions: {
        wrapWithDirectory: true,
      },
    })

    console.log("Directory uploaded with hash:", result.IpfsHash)
    return result
  } catch (error) {
    console.error("Failed to upload metadata directory:", error)
  }
}

module.exports = { uploadMetadataAsDirectory }

// Execute the function if this script is run directly
if (require.main === module) {
  uploadMetadataAsDirectory().then((response) => {
    if (response) {
      console.log("Batch upload complete:", response)
    }
  })
}
