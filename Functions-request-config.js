const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")

//File takes array of objects for two 11 player teams and generate 5 random numbers and
//finally formats these into an array of strings to be used by the gameEngine
let ArgsArray = []

// Configure the request by setting the fields below
const requestConfig = {
  // String containing the source code to be executed
  source: fs.readFileSync("./gameEngine.js").toString(),
  //source: fs.readFileSync("./API-request-example.js").toString(),
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  // Optional. Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: { apiKey: process.env.COINMARKETCAP_API_KEY ?? "" },
  // Optional if secrets are expected in the sourceLocation of secrets (only Remote or DONHosted is supported)
  secretsLocation: Location.DONHosted,
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  args: [
    '{"player_id":1,"name":"Player 1","positions":"Goalkeeper","overall_rating":97,"potential":75,"value":1000000,"Attack":84,"Midfield":64,"Defense":94,"Goalkeeping":90}',
    '{"player_id":2,"name":"Player 2","positions":"Defender","overall_rating":100,"potential":76,"value":35000000,"Attack":83,"Midfield":88,"Defense":60,"Goalkeeping":9}',
    '{"player_id":3,"name":"Player 3","positions":"Defender","overall_rating":61,"potential":65,"value":13000000,"Attack":81,"Midfield":66,"Defense":81,"Goalkeeping":7}',
    '{"player_id":4,"name":"Player 4","positions":"Defender","overall_rating":67,"potential":84,"value":84000000,"Attack":88,"Midfield":84,"Defense":82,"Goalkeeping":1}',
    '{"player_id":5,"name":"Player 5","positions":"Goalkeeper","overall_rating":82,"potential":97,"value":49000000,"Attack":96,"Midfield":68,"Defense":52,"Goalkeeping":76}',
    '{"player_id":6,"name":"Player 6","positions":"Goalkeeper","overall_rating":77,"potential":72,"value":13000000,"Attack":76,"Midfield":81,"Defense":59,"Goalkeeping":50}',
    '{"player_id":7,"name":"Player 7","positions":"Forward","overall_rating":96,"potential":78,"value":65000000,"Attack":69,"Midfield":98,"Defense":86,"Goalkeeping":7}',
    '{"player_id":8,"name":"Player 8","positions":"Forward","overall_rating":92,"potential":97,"value":63000000,"Attack":69,"Midfield":55,"Defense":52,"Goalkeeping":1}',
    '{"player_id":9,"name":"Player 9","positions":"Midfielder","overall_rating":92,"potential":87,"value":16000000,"Attack":58,"Midfield":93,"Defense":70,"Goalkeeping":7}',
    '{"player_id":10,"name":"Player 10","positions":"Goalkeeper","overall_rating":66,"potential":75,"value":78000000,"Attack":52,"Midfield":83,"Defense":99,"Goalkeeping":73}',
    '{"player_id":11,"name":"Player 11","positions":"Midfielder","overall_rating":88,"potential":66,"value":95000000,"Attack":51,"Midfield":89,"Defense":77,"Goalkeeping":4}',
    '{"player_id":12,"name":"Player 12","positions":"Midfielder","overall_rating":77,"potential":97,"value":58000000,"Attack":71,"Midfield":99,"Defense":64,"Goalkeeping":6}',
    '{"player_id":13,"name":"Player 13","positions":"Goalkeeper","overall_rating":64,"potential":98,"value":6000000,"Attack":97,"Midfield":93,"Defense":89,"Goalkeeping":94}',
    '{"player_id":14,"name":"Player 14","positions":"Forward","overall_rating":64,"potential":77,"value":29000000,"Attack":68,"Midfield":98,"Defense":52,"Goalkeeping":5}',
    '{"player_id":15,"name":"Player 15","positions":"Defender","overall_rating":63,"potential":66,"value":71000000,"Attack":93,"Midfield":96,"Defense":76,"Goalkeeping":3}',
    '{"player_id":16,"name":"Player 16","positions":"Midfielder","overall_rating":97,"potential":77,"value":11000000,"Attack":72,"Midfield":60,"Defense":56,"Goalkeeping":3}',
    '{"player_id":17,"name":"Player 17","positions":"Goalkeeper","overall_rating":81,"potential":73,"value":52000000,"Attack":89,"Midfield":72,"Defense":86,"Goalkeeping":74}',
    '{"player_id":18,"name":"Player 18","positions":"Defender","overall_rating":65,"potential":88,"value":100000000,"Attack":74,"Midfield":72,"Defense":91,"Goalkeeping":5}',
    '{"player_id":19,"name":"Player 19","positions":"Forward","overall_rating":65,"potential":97,"value":82000000,"Attack":80,"Midfield":70,"Defense":88,"Goalkeeping":9}',
    '{"player_id":20,"name":"Player 20","positions":"Forward","overall_rating":85,"potential":87,"value":41000000,"Attack":55,"Midfield":79,"Defense":62,"Goalkeeping":10}',
    '{"player_id":21,"name":"Player 21","positions":"Goalkeeper","overall_rating":62,"potential":100,"value":54000000,"Attack":56,"Midfield":80,"Defense":68,"Goalkeeping":88}',
    '{"player_id":22,"name":"Player 22","positions":"Midfielder","overall_rating":74,"potential":79,"value":66000000,"Attack":91,"Midfield":56,"Defense":50,"Goalkeeping":7}',
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538",
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538",
    "99447542792168611910106130817135939407384337273156693590731325457909168497777",
    "40098077993620304526693857714772172778452867398273480542892209412996872016597",
    "49865512548201940331497870868259804087523822397160632906748146731461641992538"
    
  ],

  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // Expected type of the returned value
  expectedReturnType: ReturnType.uint256,
}

module.exports = requestConfig
