const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config("../../.env.enc")

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

const metadataFolder = path.resolve(__dirname, "../../CB_MetaData")
const tempBatchFolder = path.resolve(__dirname, "../../tempBatchFolder")

// Helper function to split array into chunks
function chunkArray(array, chunkSize) {
  const results = []
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize))
  }
  return results
}

async function uploadMetadataAsDirectory() {
  let responses = []
  try {
    // Read all files in the metadata directory
    const files = fs.readdirSync(metadataFolder).filter((file) => file.endsWith(".json"))

    // Define the batch size
    const batchSize = 100 // Adjust this number based on your system's limits
    const fileChunks = chunkArray(files, batchSize)

    // Ensure tempBatchFolder is clean
    if (fs.existsSync(tempBatchFolder)) {
      fs.rmSync(tempBatchFolder, { recursive: true, force: true })
    }
    fs.mkdirSync(tempBatchFolder)

    // Upload each batch sequentially
    for (let i = 0; i < fileChunks.length; i++) {
      const currentBatchFolder = path.join(tempBatchFolder, `batch_${i}`)
      fs.mkdirSync(currentBatchFolder)

      // Copy files to the batch folder
      fileChunks[i].forEach((file) => {
        fs.copyFileSync(path.join(metadataFolder, file), path.join(currentBatchFolder, file))
      })

      // Upload the batch folder to IPFS
      const result = await pinata.pinFromFS(currentBatchFolder, {
        pinataMetadata: {
          name: `metadata_directory`,
        },
        pinataOptions: {
          wrapWithDirectory: false,
        },
      })

      responses.push(result)
      console.log(`Batch ${i} uploaded with hash:`, result.IpfsHash)

      // Clean up the batch folder
      fs.rmSync(currentBatchFolder, { recursive: true, force: true })
    }

    // Optionally, create a manifest file listing all hashes
    const manifest = {
      files: responses.map((r, index) => ({
        name: `batch_${index}`,
        hash: r.IpfsHash,
      })),
    }

    // Upload the manifest file to IPFS
    const manifestResponse = await pinata.pinJSONToIPFS(manifest, {
      pinataMetadata: {
        name: "metadata_manifest",
      },
    })
    console.log("Manifest uploaded:", manifestResponse)

    // Clean up tempBatchFolder
    fs.rmSync(tempBatchFolder, { recursive: true, force: true })

    return manifestResponse
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
