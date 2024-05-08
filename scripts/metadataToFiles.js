const fs = require('fs');

// Read data from the JSON file
const rawData = fs.readFileSync('nft_data/PlayerMetaData.json');
const jsonData = JSON.parse(rawData);

function convertAttributes(attributes) {
  return Object.entries(attributes).map(([key, value]) => {
    return { name: key, value };
  });
}

// Process each entry
jsonData.forEach((entry, index) => {
  // Replace the attributes object with an array
  entry.attributes = convertAttributes(entry.attributes);

  // Create a filename for each JSON file
  const fileName = `metadata/${index}.json`;

  // Write the transformed entry data to the file
  fs.writeFile(fileName, JSON.stringify(entry, null, 2), (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
    } else {
      console.log(`File ${fileName} has been written successfully.`);
    }
  });
});