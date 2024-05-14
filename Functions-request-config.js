const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")

//File takes array of objects for two 11 player teams and generate 5 random numbers and
//finally formats these into an array of strings to be used by the gameEngine
let ArgsArray = []

// Configure the request by setting the fields below
const requestConfig = {
  // String containing the source code to be executed
  source: fs.readFileSync("./gameEngine.js").toString(),
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  // Optional. Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: { apiKey: process.env.COINMARKETCAP_API_KEY ?? "" },
  // Optional if secrets are expected in the sourceLocation of secrets (only Remote or DONHosted is supported)
  secretsLocation: Location.DONHosted,
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  args: [
    "1",
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538",
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538",
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538",
  ],

  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // Expected type of the returned value
  expectedReturnType: ReturnType.bytes,
}

module.exports = requestConfig
