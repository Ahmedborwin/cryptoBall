fs = require("fs")

async function main() {
  let filteredPlayerArray

  //deal with attributes array
  const filterOutBelow85 = (attributes) => {
    const attributeValues = attributes.reduce((acc, attribute) => {
      if (/^d+$/.test(attribute.value)) {
        acc[attribute.name] = parseInt(attribute.value)
      }
      console.log(attributeValues)
      return acc
    }, {})

    attributeValues()
  }

  //read file
  const data = fs.readFile("nft_data/ALLPlayersMetaData.json")
  const parsedData = json.parse(data)
  for (let i = 0; i <= parsedData.length; i++) {
    console.log(i)
    filterOutBelow85(parsedData[i].attributes)
  }
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
