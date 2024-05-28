pragma solidity ^0.8.19;

import {CB_NFTInterface} from "contracts/interfaces/CB_NFTInterface.sol";
import {CB_VRFInterface} from "contracts/interfaces/CB_VRFInterface.sol";
import {CB_ConsumerInterface} from "contracts/interfaces/CB_ConsumerInterface.sol";
import {CBToken} from "contracts/CBToken.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

error CBMANAGER__NotTokenOwner();
error CBMANAGER__TeamNameTaken();
error CBMANAGER__ManagerAlreadyRegistered();
error CBMANAGER__ManagerNotYetRegistered();
error CBMANAGER__CallerNotAdmin(address Caller);
error CBMANAGER__NFTAlreadyStaked(address playerAddress);
error CBMANAGER__NFTListedForSale();

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
      revert CBMANAGER__CallerNotAdmin(_caller);
    }
    _;
  }

  modifier isManagerRegistered(address _caller) {
    if (!isManagerRegisteredTable[_caller]) {
      revert CBMANAGER__ManagerNotYetRegistered();
    }
    _;
  }

  modifier isManagerNotRegistered(address _caller) {
    if (isManagerRegisteredTable[_caller]) {
      revert CBMANAGER__ManagerAlreadyRegistered();
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
  mapping(address => bool) public rosterFilled;
  mapping(uint256 => Player[]) public creatorRosterTable;
  mapping(uint256 => Player[]) public challengerRosterTable;

  //PlayerStakings Structures
  mapping(uint256 => address) public NFTStakedBy;

  //TEST
  uint8[] public testPlayerIndexArray;
  uint256[] public testTokenIdArray;
  event testEvent(bytes indexed buffer, uint8 indexed winner, uint8 indexed team1goals);

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
  CBToken public cbTokenContract;

  //Events

  event NewManagerRegistered(address _player, string teamname);

  event StakingProcessFailed(address _player, bytes Reason);

  event CreateGame(uint256 id, address creator, uint256 creationTime);

  event AcceptGame(uint256 id, address challenger);

  event StartGame(uint256 id);

  event CancelGame(uint256 id);

  event FinalizeGame(uint256 id, address winner, uint256 team1Goals, uint256 team2Goals);

  event Draw(address gameCreator, address challenger, uint256 team1Goals, uint256 team2Goals);

  event testEvent1(uint256 upgradedTokenID, uint256 upgradedAttribute);

  //constructor

  constructor(address _CBMANAGERAddress, address _VRFAddress, address _consumerAddress) {
    i_NFT = CB_NFTInterface(_CBMANAGERAddress);
    i_VRF = CB_VRFInterface(_VRFAddress);
    i_Consumer = CB_ConsumerInterface(_consumerAddress);
    admin = msg.sender;
  }

  //Create New Manager Pofile
  function registerNewManager(string calldata _teamName) external isManagerNotRegistered(msg.sender) {
    if (isTeamNameTaken[_teamName]) {
      revert CBMANAGER__TeamNameTaken();
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

    //Send Winner tokens
    cbTokenContract.transfer(msg.sender, 20 ether);

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

  function startGame(uint256 _id) public {
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
      gameId := mload(add(add(buffer, 0x20), offset))
      gameId := shr(224, gameId) // shift right by 224 bits to keep only the first 32 bits
    }
    offset += 4;

    // Check game status to ensure it can be finalized
    require(games[gameId].status == 2, "Game cannot be finalized");

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

      if (winner == 0) {
        upgradedTokenID = game.creatorRoster[tokenIndex].tokenID;
      } else {
        upgradedTokenID = game.challengerRoster[tokenIndex].tokenID;
      }

      _upgradeToken(upgradedTokenID, upgradedAttribute);
      emit testEvent1(upgradedTokenID, upgradedAttribute);
    }

    if (winner == 0) {
      game.winner = game.creator;
      creatorStats.wins++;
      challengerStats.losses++;
      cbTokenContract.transfer(game.winner, 5 ether);
    } else if (winner == 1) {
      game.winner = game.challenger;
      creatorStats.losses++;
      challengerStats.wins++;
      cbTokenContract.transfer(game.winner, 5 ether);
    } else {
      //How to handle draw?
      emit Draw(game.creator, game.challenger, team1Goals, team2Goals);
    }

    // Update total goals for managers
    creatorStats.totalGoals += uint256(team1Goals);
    challengerStats.totalGoals += uint256(team2Goals);

    // Update state of game with further details
    game.completionTime = block.timestamp;

    //COmmented out for the sake of testing,
    //otherwise would need to set up a new game for each time this funciton is triggered succesfully
    //game.status = 3; // set game status to completed

    emit FinalizeGame(gameId, game.winner, team1Goals, team2Goals);
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
    address _playerAddress,
    Position _position,
    uint256 _tokenID,
    uint8 _index
  ) public isManagerRegistered(msg.sender) {
    if (!i_NFT.isNFTOwner(_playerAddress, _tokenID)) {
      emit StakingProcessFailed(_playerAddress, abi.encodePacked("Does Not Own The TokenId: ", _tokenID.toString()));
      revert CBMANAGER__NotTokenOwner();
    }
    //Check if NFT is already staked on a team
    if (NFTStakedBy[_tokenID] != address(0)) {
      revert CBMANAGER__NFTAlreadyStaked(NFTStakedBy[_tokenID]);
    }
    //Check if NFT is listed for sale
    if (i_NFT.getIsNFTListed(_tokenID)) {
      revert CBMANAGER__NFTListedForSale();
    }
    //get URI Index
    uint256 _BaseURIndex = i_NFT.getBasePlayerIndexFromId(_tokenID);
    // _index should be 99 to indicate adding a new player
    if (_index == 99 && rosters[_playerAddress].length <= 11) {
      // Extend the array if the index is beyond current length
      rosters[_playerAddress].push(Player(_tokenID, _BaseURIndex, true, _position));
      //Update NFT Stake mapping

      NFTStakedBy[_tokenID] = msg.sender;
    } else if (_index <= 10 && _index >= 0) {
      // Otherwise Update the existing NFT at the index
      //Record old NFT no longer staked
      NFTStakedBy[rosters[_playerAddress][_index].tokenID] = address(0);
      //Record New NFT Info
      rosters[_playerAddress][_index].tokenID = _tokenID;
      rosters[_playerAddress][_index].uriIndex = _BaseURIndex;
      rosters[_playerAddress][_index].playerPosition = _position;
      rosters[_playerAddress][_index].active = true;
      //Update NFT Stake mapping
      NFTStakedBy[_tokenID] = msg.sender;
    } else {
      revert("Invalid TokenId");
    }
    //check if 11 players staked for player
    if (rosters[_playerAddress].length == 11) {
      rosterFilled[_playerAddress] = true;
    } else {
      rosterFilled[_playerAddress] = false;
    }
  }

  //Lootbox
  function openLootbox() external {
    //transferFrom msg.sender to this address 5 tokens
    require(cbTokenContract.transferFrom(msg.sender, address(this), 5 ether), "Token Transfer Failed");
    i_VRF.requestRandomNumber(1, msg.sender, 0, 5);
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
  }

  //Getter Calls
  function getRosterForPlayer(address _managerAddress) external view returns (Player[] memory) {
    return rosters[_managerAddress];
  }

  function getGameDetails(uint256 _gameID) public view returns (Game memory) {
    return games[_gameID];
  }

  function getIsNFTStaked(uint256 _tokenId) external view returns (address) {
    return NFTStakedBy[_tokenId];
  }

  function isNFTListed(uint256 _tokenId) external view returns (bool) {
    return i_NFT.getIsNFTListed(_tokenId);
  }

  //External Setter Functions - ONLY ADMIN

  function setTokenContract(address _tokenAddress) external onlyAdmin(msg.sender) {
    cbTokenContract = CBToken(_tokenAddress);
  }

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
