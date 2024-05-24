pragma solidity ^0.8.19;

import {CB_NFTInterface} from "contracts/interfaces/CB_NFTInterface.sol";
import {CB_VRFInterface} from "contracts/interfaces/CB_VRFInterface.sol";
import {CB_ConsumerInterface} from "contracts/interfaces/CB_ConsumerInterface.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

error CBNFT__NotTokenOwner();
error CBNFT__TeamNameTaken();
error CBNFT__ManagerAlreadyRegistered();
error CBNFT__ManagerNotYetRegistered();
error CBNFT__CallerNotAdmin(address Caller);

contract MatchManager {
  using Strings for uint256;

  //Function Modifiers

  modifier onlyAdmin(address _caller) {
    if (
      _caller != address(admin) &&
      _caller != address(i_Consumer) &&
      _caller != address(i_NFT) &&
      _caller != address(i_VRF)
    ) {
      revert CBNFT__CallerNotAdmin(_caller);
    }
    _;
  }

  modifier isManagerRegistered(address _caller) {
    if (!isManagerRegisteredTable[_caller]) {
      revert CBNFT__ManagerNotYetRegistered();
    }
    _;
  }

  modifier isManagerNotRegistered(address _caller) {
    if (isManagerRegisteredTable[_caller]) {
      revert CBNFT__ManagerAlreadyRegistered();
    }
    _;
  }

  enum Position {
    GoalKeeper,
    Defence,
    Midfield,
    Striker
  }

  address public admin;
  uint256 public totalGames; //Total number of games created
  bytes public testVariable;

  //Data Structures
  struct Player {
    uint256 tokenID;
    uint256 uriIndex;
    bool active;
    Position playerPosition;
  }

  mapping(address => Player[]) public rosters;
  mapping(address => string[]) public tokenIdStringTable; //TODO: RENAME THIS!!
  mapping(address => bool) public rosterFilled;
  mapping(uint256 => Player[]) public creatorRosterTable;
  mapping(uint256 => Player[]) public challengerRosterTable;

  //TEST
  uint8[] public testPlayerIndexArray;
  uint256[] public testTokenIdArray;

  struct Game {
    uint256 id; //id of game
    address creator; //address of creator
    Player[] creatorRoster;
    address challenger; //address of challenger
    Player[] challengerRoster;
    address winner; //address of winner
    uint256 creationTime; //unix time (seconds) when game was created
    uint256 blockAccepted; //unix time (seconds) when game was accepted
    uint256 completionTime; //unix time (seconds) when completed and paid out
    uint256 status;
    //0 = null (untouched)
    //1 = active
    //2 = accepted
    //3 = completed
    //4 = cancelled
    //5 = expired
  }
  mapping(uint256 => Game) public games;

  mapping(string => bool) public isTeamNameTaken;
  mapping(address => bool) public isManagerRegisteredTable;

  struct Stats {
    string teamName;
    uint256 wins; //number of wins
    uint256 losses; //number of losses
    uint256 totalGoals; //number of total goals
    uint256 activeGames; //number of active games created by given user
    uint256 totalUserGames; //number of total games ever created by given user
    mapping(uint256 => uint256) userGameIds; //ids of all games created by user
    uint256 totalUserAcceptedGames; //number of total games ever accepted by given user
    mapping(uint256 => uint256) userAcceptedGameIds; //ids of all games accepted by user
  }
  mapping(address => Stats) public ManagerStats;

  //Interfaces
  CB_NFTInterface public i_NFT;
  CB_VRFInterface public i_VRF;
  CB_ConsumerInterface public i_Consumer;

  //Events

  event NewManagerRegistered(address _player, string teamname);

  event StakingProcessFailed(address _player, bytes Reason);

  event CreateGame(uint256 id, address creator, uint256 creationTime);

  event AcceptGame(uint256 id, address challenger);

  event StartGame(uint256 id);

  event CancelGame(uint256 id);

  event FinalizeGame(uint256 id, address winner, uint256 completionTime);

  //constructor

  constructor(address _CBNFTAddress, address _VRFAddress, address _consumerAddress) {
    i_NFT = CB_NFTInterface(_CBNFTAddress);
    i_VRF = CB_VRFInterface(_VRFAddress);
    i_Consumer = CB_ConsumerInterface(_consumerAddress);
    admin = msg.sender;
  }

  //Create New Manager Pofile
  function registerNewManager(string calldata _teamName) external isManagerNotRegistered(msg.sender) {
    if (isTeamNameTaken[_teamName]) {
      revert CBNFT__TeamNameTaken();
    }

    // Initialize the new team stats
    Stats storage newTeam = ManagerStats[msg.sender];
    newTeam.teamName = _teamName;
    newTeam.wins = 0;
    newTeam.losses = 0;
    newTeam.activeGames = 0;
    newTeam.totalUserGames = 0;
    newTeam.totalUserAcceptedGames = 0;

    isManagerRegisteredTable[msg.sender] = true; //register new manager

    //emit New Manager Event
    emit NewManagerRegistered(msg.sender, _teamName);
  }

  //Publicly Accessible Functions

  function createGame() public isManagerRegistered(msg.sender) returns (uint256) {
    require(_rosterFilled(msg.sender));

    //setup game
    totalGames++;
    games[totalGames].id = totalGames;
    games[totalGames].creator = msg.sender;
    games[totalGames].creationTime = block.timestamp;
    //This timestamp is early by one block, but this minor
    //innaccuracy does not hurt performance
    games[totalGames].status = 1; //set game to active
    games[totalGames].creatorRoster = rosters[msg.sender];

    creatorRosterTable[totalGames] = rosters[msg.sender];

    //Update creator's created game count and list
    //QUERY: Should active games update on game accepted rather than create?
    ManagerStats[msg.sender].activeGames++;
    ManagerStats[msg.sender].totalUserGames++;
    ManagerStats[msg.sender].userGameIds[ManagerStats[msg.sender].totalUserGames] = totalGames;
    //Set latest game in creator's created game list to this game
    emit CreateGame(games[totalGames].id, games[totalGames].creator, games[totalGames].creationTime);
    return totalGames;
  }

  function acceptGame(uint256 _id) public isManagerRegistered(msg.sender) {
    require(games[_id].creator != msg.sender, "Challenger can not be creator...");
    require(_checkActive(_id), "Game is not active...");
    require(_rosterFilled(msg.sender));

    games[_id].challenger = msg.sender;
    games[_id].status = 2; //Set status to pending
    games[totalGames].challengerRoster = rosters[msg.sender];

    ManagerStats[games[_id].creator].activeGames--;

    //Update challenger's accepted game count and list
    ManagerStats[msg.sender].totalUserAcceptedGames++;
    ManagerStats[msg.sender].userAcceptedGameIds[ManagerStats[msg.sender].totalUserAcceptedGames] = _id;
    //Set latest game in challenger's accepted game list to this game

    emit AcceptGame(_id, games[_id].challenger);
  }

  function requestRandomNumbers(uint256 _id) public {
    require(_checkAccepted(_id), "Game is not Accepted...");
    require(_rosterFilled(games[_id].creator));
    require(_rosterFilled(games[_id].challenger));

    //request Random Number from BRFHandler
    i_VRF.requestRandomNumber(2, address(0), _id, 10);
  }

  //TODO: Add modifier to restrict who can call this function
  function finalizeGame(bytes memory buffer) external {
    _finalizeGame(buffer, msg.sender);
  }

  function _finalizeGame(bytes memory buffer, address _caller) internal {
    uint256 offset = 0;

    // Read gameId from buffer
    uint256 gameId;
    assembly {
      gameId := mload(add(buffer, add(offset, 32)))
    }
    offset += 4;

    // Check game status to ensure it can be finalized
    require(games[gameId].status == 2, "Game Status should be accepted");

    // Read winner, team1Goals, and team2Goals from buffer
    uint8 winner = uint8(buffer[offset]);
    offset++;
    uint8 team1Goals = uint8(buffer[offset]);
    offset++;
    uint8 team2Goals = uint8(buffer[offset]);
    offset++;

    // Cache game and manager stats in memory to minimize storage accesses
    Game storage game = games[gameId];
    Stats storage creatorStats = ManagerStats[game.creator];
    Stats storage challengerStats = ManagerStats[game.challenger];

    // Upgrade tokens based on winner
    uint256 upgradedTokenID;
    for (uint i = 0; i < 4; i++) {
      uint8 tokenIndex = uint8(buffer[offset]);
      uint8 upgradedAttribute = uint8(buffer[offset + 1]);
      offset += 2;

      testPlayerIndexArray.push(tokenIndex);

      //-------------------------------------------------------
      //THIS IS THE BIT THAT IS CAUSING THE ISSUE

      // check which array we are looking at based on who is the winner
      // if (winner == uint8(0)) {}
      // else {}

      upgradedTokenID = creatorRosterTable[gameId][tokenIndex].tokenID;

      testTokenIdArray.push(upgradedTokenID);

      // _upgradeToken(upgradedTokenID, upgradedAttribute);

      //-------------------------------------------------------
    }

    // Assign winner based on winner variable
    if (winner == uint8(0)) {
      game.winner = game.creator;
    } else if (winner == uint8(1)) {
      game.winner = game.challenger;
    }

    // Update total goals for managers
    creatorStats.totalGoals += uint256(team1Goals);
    challengerStats.totalGoals += uint256(team2Goals);

    // // COmmented out for the sake of testing,
    // // otherwise would need to set up a new game for each time this funciton is triggered succesfully
    // // Update state of game with further details
    //  game.completionTime = block.timestamp;
    // game.status = 3; // set game status to completed

    emit FinalizeGame(gameId, game.winner, game.completionTime);
  }

  function _upgradeToken(uint256 _tokenID, uint8 _attribute) internal {
    uint8 previousValue = i_NFT.getTokenUpgradeValue(_tokenID, _attribute);
    i_NFT.modifyUpgrade(_tokenID, _attribute, previousValue + 1);
  }

  function cancelGame(uint256 _id) public isManagerRegistered(msg.sender) {
    require(games[_id].creator == msg.sender, "Attempted to cancel game without ownership...");
    require(_checkActive(_id), "Game is already pending or inactive...");

    //Return wager to creator

    games[_id].status = 4; //set game status to cancelled

    ManagerStats[msg.sender].activeGames--; //decrease number of active games for user

    emit CancelGame(_id);
  }

  function cancelAllGames() public isManagerRegistered(msg.sender) {
    require(ManagerStats[msg.sender].activeGames > 0, "User has no active games to cancel...");

    uint256 _totalUserGames = ManagerStats[msg.sender].totalUserGames;
    //mapping(uint256 => uint256) userGameIds; //ids of all games created by user

    while (ManagerStats[msg.sender].activeGames > 0) {
      if (_checkActive(ManagerStats[msg.sender].userGameIds[_totalUserGames])) {
        cancelGame(ManagerStats[msg.sender].userGameIds[_totalUserGames]);
      }
      _totalUserGames--;
    }
  }

  function setRosterPosition(
    address _user,
    Position _position,
    uint256 _tokenID,
    uint8 _index
  ) public isManagerRegistered(msg.sender) {
    if (!i_NFT.isNFTOwner(_user, _tokenID)) {
      emit StakingProcessFailed(_user, abi.encodePacked("Does Not Own The TokenId: ", _tokenID.toString()));
      revert CBNFT__NotTokenOwner();
    }
    //get URI Index
    uint256 _BaseURIndex = i_NFT.getBasePlayerIndexFromId(_tokenID);
    //TODO: Need to think about this + Clean up
    // By default _index should be 99 to indicate adding a new player
    if (_index == 99) {
      // Extend the array if the index is beyond current length
      rosters[_user].push(Player(_tokenID, _BaseURIndex, true, _position));
    } else if (_index <= 10 && _index >= 0) {
      // Otherwise Update the existing player at the index
      rosters[_user][_index].tokenID = _tokenID;
      rosters[_user][_index].uriIndex = _BaseURIndex;
      rosters[_user][_index].playerPosition = _position;
      rosters[_user][_index].active = true;
    } else {
      revert("Invalid TokenId");
    }
    //check if 11 players staked for player
    if (rosters[_user].length == 11) {
      rosterFilled[_user] = true;
    } else {
      rosterFilled[_user] = false;
    }
  }

  //Internal Utility Functions
  function _checkActive(uint256 _id) internal view returns (bool) {
    return (games[_id].status == 1);
  }

  function _checkAccepted(uint256 _id) internal view returns (bool) {
    return (games[_id].status == 2);
  }

  function _rosterFilled(address _user) internal view returns (bool) {
    return rosterFilled[_user];
    // for (uint256 i = 0; i < 11; i++) {
    //   if (rosters[_user][i].active == false) {
    //     return false;
    //   }
    // }
    // return true;
  }

  //Getter Calls
  function getRosterForPlayer(address _managerAddress) external view returns (Player[] memory) {
    return rosters[_managerAddress];
  }

  function getGameDetails(uint256 _gameID) public view returns (Game memory) {
    return games[_gameID];
  }

  function getTestArray() external view returns (uint8[] memory) {
    return testPlayerIndexArray;
  }

  function getTestArray2() external view returns (uint256[] memory) {
    return testTokenIdArray;
  }

  //External Helper Functions

  //set nft address
  function setNFTAddress(address _NFTAddress) external onlyAdmin(msg.sender) {
    i_NFT = CB_NFTInterface(_NFTAddress);
  }
  //set VRF Address
  function setVRFHandlerAddress(address _vrfHandler) external onlyAdmin(msg.sender) {
    i_VRF = CB_VRFInterface(_vrfHandler);
  }

  // set functions consumer address
  function setFunctionsConsumerAddress(address _consumerAddress) external onlyAdmin(msg.sender) {
    i_Consumer = CB_ConsumerInterface(_consumerAddress);
  }
}
