const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

const jsonData = [
  {
    name: "Erling Braut Haaland",
    overall_rating: "91",
    potential: "94",
    club_position: "ST",
    country_name: "Norway",
    attack: 89,
    defense: 56,
    midfield: 79,
    goalkeeping: 10,
  },
  {
    name: "Kylian Mbappé Lottin",
    overall_rating: "91",
    potential: "94",
    club_position: "ST",
    country_name: "France",
    attack: 93,
    defense: 45,
    midfield: 87,
    goalkeeping: 8,
  },
  {
    name: "Kevin De Bruyne",
    overall_rating: "91",
    potential: "91",
    club_position: "RCM",
    country_name: "Belgium",
    attack: 84,
    defense: 68,
    midfield: 90,
    goalkeeping: 11,
  },
  {
    name: "Rodrigo Hernández Cascante",
    overall_rating: "90",
    potential: "91",
    club_position: "LCM",
    country_name: "Spain",
    attack: 77,
    defense: 85,
    midfield: 86,
    goalkeeping: 10,
  },
  {
    name: "Harry Kane",
    overall_rating: "90",
    potential: "90",
    club_position: "ST",
    country_name: "England",
    attack: 83,
    defense: 56,
    midfield: 85,
    goalkeeping: 11,
  },
  {
    name: "Thibaut Nicolas Marc Courtois",
    overall_rating: "90",
    potential: "90",
    club_position: "SUB",
    country_name: "Belgium",
    attack: 40,
    defense: 27,
    midfield: 49,
    goalkeeping: 87,
  },
  {
    name: "Robert Lewandowski",
    overall_rating: "90",
    potential: "90",
    club_position: "ST",
    country_name: "Poland",
    attack: 85,
    defense: 53,
    midfield: 82,
    goalkeeping: 10,
  },
  {
    name: "Lionel Andrés Messi Cuccittini",
    overall_rating: "90",
    potential: "90",
    club_position: "RW",
    country_name: "Argentina",
    attack: 88,
    defense: 39,
    midfield: 89,
    goalkeeping: 11,
  },
  {
    name: "Rúben dos Santos Gato Alves Dias",
    overall_rating: "89",
    potential: "90",
    club_position: "RCB",
    country_name: "Portugal",
    attack: 56,
    defense: 90,
    midfield: 74,
    goalkeeping: 9,
  },
  {
    name: "Vinícius José Paixão de Oliveira Júnior",
    overall_rating: "89",
    potential: "94",
    club_position: "LS",
    country_name: "",
    attack: 88,
    defense: 37,
    midfield: 84,
    goalkeeping: 7,
  },
  {
    name: "Alisson Ramsés Becker",
    overall_rating: "89",
    potential: "89",
    club_position: "GK",
    country_name: "",
    attack: 41,
    defense: 28,
    midfield: 56,
    goalkeeping: 87,
  },
  {
    name: "Mohamed Salah Ghaly",
    overall_rating: "89",
    potential: "89",
    club_position: "RW",
    country_name: "",
    attack: 89,
    defense: 53,
    midfield: 87,
    goalkeeping: 12,
  },
  {
    name: "Virgil van Dijk",
    overall_rating: "89",
    potential: "89",
    club_position: "LCB",
    country_name: "Netherlands",
    attack: 68,
    defense: 89,
    midfield: 77,
    goalkeeping: 12,
  },
  {
    name: "Marc-André ter Stegen",
    overall_rating: "89",
    potential: "89",
    club_position: "GK",
    country_name: "Germany",
    attack: 38,
    defense: 32,
    midfield: 57,
    goalkeeping: 87,
  },
  {
    name: "Neymar da Silva Santos Júnior",
    overall_rating: "89",
    potential: "89",
    club_position: "RES",
    country_name: "",
    attack: 86,
    defense: 41,
    midfield: 88,
    goalkeeping: 12,
  },
  {
    name: "Karim Benzema",
    overall_rating: "89",
    potential: "89",
    club_position: "ST",
    country_name: "",
    attack: 84,
    defense: 45,
    midfield: 85,
    goalkeeping: 8,
  },
  {
    name: "Jude Victor William Bellingham",
    overall_rating: "88",
    potential: "92",
    club_position: "CAM",
    country_name: "England",
    attack: 84,
    defense: 79,
    midfield: 87,
    goalkeeping: 10,
  },
  {
    name: "Federico Santiago Valverde Dipetta",
    overall_rating: "88",
    potential: "92",
    club_position: "RCM",
    country_name: "",
    attack: 85,
    defense: 81,
    midfield: 86,
    goalkeeping: 9,
  },
  {
    name: "Lautaro Javier Martínez",
    overall_rating: "88",
    potential: "90",
    club_position: "LS",
    country_name: "Argentina",
    attack: 85,
    defense: 58,
    midfield: 83,
    goalkeeping: 10,
  },
  {
    name: "Bernardo Mota Veiga de Carvalho e Silva",
    overall_rating: "88",
    potential: "88",
    club_position: "SUB",
    country_name: "Portugal",
    attack: 83,
    defense: 69,
    midfield: 90,
    goalkeeping: 11,
  },
  {
    name: "Ederson Santana de Moraes",
    overall_rating: "88",
    potential: "89",
    club_position: "GK",
    country_name: "",
    attack: 47,
    defense: 33,
    midfield: 64,
    goalkeeping: 87,
  },
  {
    name: "Jan Oblak",
    overall_rating: "88",
    potential: "88",
    club_position: "GK",
    country_name: "",
    attack: 39,
    defense: 33,
    midfield: 55,
    goalkeeping: 85,
  },
  {
    name: "Antoine Griezmann",
    overall_rating: "88",
    potential: "88",
    club_position: "RS",
    country_name: "France",
    attack: 87,
    defense: 62,
    midfield: 88,
    goalkeeping: 13,
  },
]

async function uploadMetadataAsBatch() {
  let responses = []
  try {
    for (let i = 0; i < jsonData.length; i++) {
      const data = jsonData[i]
      const options = {
        pinataMetadata: {
          name: `metadata_${i}`,
        },
        pinataOptions: {
          wrapWithDirectory: false,
        },
      }
      const result = await pinata.pinJSONToIPFS(data, options)
      responses.push({
        fileName: `metadata_${i}.json`,
        IpfsHash: result.IpfsHash,
      })
    }

    // Optionally, create a manifest file listing all hashes
    const manifest = {
      files: responses.map((r) => ({
        name: r.fileName,
        hash: r.IpfsHash,
      })),
    }
    const manifestResponse = await pinata.pinJSONToIPFS(manifest, {
      pinataMetadata: {
        name: "metadata_manifest",
      },
    })
    console.log("Manifest uploaded:", manifestResponse)

    return manifestResponse
  } catch (error) {
    console.error("Failed to upload metadata batch:", error)
  }
}

module.exports = { uploadMetadataAsBatch }
