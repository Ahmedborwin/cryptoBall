pragma solidity ^0.8.19;

import {CB_NFTInterface} from "contracts/interfaces/CB_NFTInterface.sol";
import {CB_VRFInterface} from "contracts/interfaces/CB_VRFInterface.sol";
import {CB_ConsumerInterface} from "contracts/interfaces/CB_ConsumerInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error CBNFT__NotTokenOwner();

contract MatchManager {
  using Strings for uint256;
  //Function Modifiers
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  enum Position {
    GoalKeeper,
    Defence,
    Midfield,
    Striker
  }

  address public owner;
  uint256 public totalGames; //Total number of games created

  //Data Structures
  struct Player {
    uint256 tokenID;
    bool active;
    Position playerPosition;
  }

  mapping(address => Player[]) public rosters;
  mapping(address => string[]) public tokenIdStringTable; //TODO: RENAME THIS!!

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

  struct Stats {
    uint256 wins; //number of wins
    uint256 losses; //number of losses
    uint256 activeGames; //number of active games created by given user
    uint256 totalUserGames; //number of total games ever created by given user
    mapping(uint256 => uint256) userGameIds; //ids of all games created by user
    uint256 totalUserAcceptedGames; //number of total games ever accepted by given user
    mapping(uint256 => uint256) userAcceptedGameIds; //ids of all games accepted by user
  }
  mapping(address => Stats) public stats;

  //Interfaces
  CB_NFTInterface public i_NFT;
  CB_VRFInterface public i_VRF;
  CB_ConsumerInterface public i_Consumer;

  //Events

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
  }
  //Publicly Accessible Functions

  function createGame() public returns (uint256) {
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

    //Update creator's created game count and list
    //QUERY: Should active games update on game accepted rather than create?
    stats[msg.sender].activeGames++;
    stats[msg.sender].totalUserGames++;
    stats[msg.sender].userGameIds[stats[msg.sender].totalUserGames] = totalGames;
    //Set latest game in creator's created game list to this game
    emit CreateGame(games[totalGames].id, games[totalGames].creator, games[totalGames].creationTime);
    return totalGames;
  }

  function acceptGame(uint256 _id) public {
    require(games[_id].creator != msg.sender, "Challenger can not be creator...");
    require(_checkActive(_id), "Game is not active...");
    require(_rosterFilled(msg.sender));

    games[_id].challenger = msg.sender;
    games[_id].status = 2; //Set status to pending
    games[totalGames].challengerRoster = rosters[msg.sender];

    stats[games[_id].creator].activeGames--;

    //Update challenger's accepted game count and list
    stats[msg.sender].totalUserAcceptedGames++;
    stats[msg.sender].userAcceptedGameIds[stats[msg.sender].totalUserAcceptedGames] = _id;
    //Set latest game in challenger's accepted game list to this game

    emit AcceptGame(_id, games[_id].challenger);
  }

  function requestRandomNumbers(uint256 _id) public {
    require(games[_id].creator != msg.sender, "Challenger can not be creator...");
    require(_checkActive(_id), "Game is not active...");
    require(_rosterFilled(msg.sender));

    //request Random Number from BRFHandler
    i_VRF.requestRandomNumber(2, address(0), _id, 10);
  }

  // function startGame(uint256 _id, uint256[] calldata _randomNumbers) public {
  //   string[] storage _args;
  //   Player[] memory creatorTeam = games[_id].creatorRoster;
  //   Player[] memory challengerTeam = games[_id].challengerRoster;
  //   //How to get the staked Player lists as an array of Strings
  //   //TODO: There must be a better way to do this. Can we store the tokenIds as string when we first stake them?
  //   for (uint8 i; i < creatorTeam.length; i++) {
  //     string memory tokenIdString = creatorTeam[i].tokenID.toString();
  //     _args.push(tokenIdString);
  //   }

  //   for (uint8 i; i < challengerTeam.length; i++) {
  //     string memory tokenIdString = challengerTeam[i].tokenID.toString();
  //     _args.push(tokenIdString);
  //   }

  //   for (uint8 i; i < _randomNumbers.length; i++) {
  //     string memory randomNumberString = _randomNumbers[i].toString();
  //     _args.push(randomNumberString);
  //   }

  //   i_Consumer.sendRequest(_args);

  //   emit StartGame(_id);
  // }

  function finalizeGame(uint256 _id) public {
    require(games[_id].status == 2, "Game status is not pending...");
    uint256 winner = 0;
    require((winner == 0 || winner == 1), "Random winner result not within expect bounds...");

    //Updates user statistics and winner of current game
    if (winner == 0) {
      games[_id].winner = games[_id].creator;
      stats[games[_id].creator].wins++;
      stats[games[_id].challenger].losses++;
    } else if (winner == 1) {
      games[_id].winner = games[_id].challenger;
      stats[games[_id].challenger].wins++;
      stats[games[_id].creator].losses++;
    }

    //Update state of game with further details
    games[_id].completionTime = block.timestamp;
    games[_id].status = 3; //set game status to completed

    emit FinalizeGame(_id, games[_id].winner, games[_id].completionTime);
  }

  function cancelGame(uint256 _id) public {
    require(games[_id].creator == msg.sender, "Attempted to cancel game without ownership...");
    require(_checkActive(_id), "Game is already pending or inactive...");

    //Return wager to creator

    games[_id].status = 4; //set game status to cancelled

    stats[msg.sender].activeGames--; //decrease number of active games for user

    emit CancelGame(_id);
  }

  function cancelAllGames() public {
    require(stats[msg.sender].activeGames > 0, "User has no active games to cancel...");

    uint256 _totalUserGames = stats[msg.sender].totalUserGames;
    //mapping(uint256 => uint256) userGameIds; //ids of all games created by user

    while (stats[msg.sender].activeGames > 0) {
      if (_checkActive(stats[msg.sender].userGameIds[_totalUserGames])) {
        cancelGame(stats[msg.sender].userGameIds[_totalUserGames]);
      }
      _totalUserGames--;
    }
  }

  function setRosterPosition(address _user, Position _position, uint256 _tokenID, uint8 _index) public {
    if (!i_NFT.isNFTOwner(_user, _tokenID)) {
      emit StakingProcessFailed(_user, abi.encodePacked("Does Not Own The TokenId: ", _tokenID.toString()));
      revert CBNFT__NotTokenOwner();
    }
    //TODO: Need to think about this + Clean up
    // By default _index should be 99 to indicate adding a new player
    if (_index == 99) {
      // Extend the array if the index is beyond current length
      rosters[_user].push(Player(_tokenID, true, _position));
    } else if (_index <= 10 && _index >= 0) {
      // Otherwise Update the existing player at the index
      rosters[_user][_index].tokenID = _tokenID;
      rosters[_user][_index].playerPosition = _position;
      rosters[_user][_index].active = true;
    } else {
      revert("Invalid TokenId");
    }
  }

  //Internal Utility Functions
  function _checkActive(uint256 _id) internal view returns (bool) {
    return (games[_id].status == 1);
  }

  function _rosterFilled(address _user) internal view returns (bool) {
    for (uint256 i = 0; i < 11; i++) {
      if (rosters[_user][i].active == false) {
        return false;
      }
    }
    return true;
  }

  //External Helper Functions
  //set nft address
  function setNFTAddress(address _NFTAddress) external onlyOwner {
    i_NFT = CB_NFTInterface(_NFTAddress);
  }
  //set VRF Address
  function setVRFHandlerAddress(address _vrfHandler) external onlyOwner {
    i_VRF = CB_VRFInterface(_vrfHandler);
  }

  function getGameDetails(uint256 _gameID) public view returns (Game memory) {
    return games[_gameID];
  }
}
