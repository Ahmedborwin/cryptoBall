//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {CB_NFTInterface} from "contracts/interfaces/CB_NFTInterface.sol";
import {CB_ConsumerInterface} from "contracts/interfaces/CB_ConsumerInterface.sol";
import {CB_MatchManagerInterface} from "contracts/interfaces/CB_MatchManagerInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error CBVRF__CallerNotAdmin(address);

contract VRFRequestHandler is VRFConsumerBaseV2Plus {
  using Strings for uint256;

  //Modifiers
  modifier onlyAdmin(address _caller) {
    if (_caller != address(contract_Admin) && _caller != address(i_MatchManager)) {
      revert CBVRF__CallerNotAdmin(_caller);
    }
    _;
  }

  enum RequestType {
    LootBox,
    GameSimulation
  }

  struct RequestDetails {
    RequestType requestType;
    address player;
    uint256 challengeId;
  }

  //store address of player
  mapping(uint256 => RequestDetails) public s_RequestTable;
  mapping(uint256 => bool) public testMapping;

  // Chainlink VRF Variables
  IVRFCoordinatorV2Plus private immutable i_vrfCoordinator;
  uint256 public immutable s_subscriptionId;
  bytes32 public immutable s_gasLane;
  uint32 public immutable s_callbackGasLimit;
  uint16 public constant REQUEST_CONFIRMATIONS = 3;

  //initialise structs
  RequestDetails requestDetails;
  //Interfaces
  CB_NFTInterface public i_NFT;
  CB_ConsumerInterface public i_Consumer;
  CB_MatchManagerInterface public i_MatchManager;
  //admin
  address public contract_Admin;

  event PackOpened(
    address player,
    uint256 player1Index,
    uint256 player2Index,
    uint256 player3Index,
    uint256 player4Index,
    uint256 player5Index
  );

  constructor(
    address vrfCoordinatorV2,
    uint256 subscriptionId,
    bytes32 gasLane, // keyHash
    uint32 callbackGasLimit,
    address _CBNFTAddress,
    address _contract_Admin,
    address _consumerAddress,
    address _matchManagerAddress
  ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
    i_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinatorV2);
    s_gasLane = gasLane;
    s_subscriptionId = subscriptionId;
    s_callbackGasLimit = callbackGasLimit;
    contract_Admin = _contract_Admin;
    i_NFT = CB_NFTInterface(_CBNFTAddress);
    i_Consumer = CB_ConsumerInterface(_consumerAddress);
    i_MatchManager = CB_MatchManagerInterface(_matchManagerAddress);
  }

  function requestRandomNumber(
    uint8 _requestType,
    address _player,
    uint256 _challengeId,
    uint32 _randomNumbersReq
  ) external onlyAdmin(msg.sender) returns (uint256 requestId) {
    requestId = i_vrfCoordinator.requestRandomWords(
      VRFV2PlusClient.RandomWordsRequest({
        keyHash: s_gasLane,
        subId: s_subscriptionId,
        requestConfirmations: REQUEST_CONFIRMATIONS,
        callbackGasLimit: s_callbackGasLimit,
        numWords: _randomNumbersReq,
        extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
      })
    );
    //if loot box request
    if (_requestType == 1) {
      s_RequestTable[requestId].requestType = RequestType.LootBox;
      s_RequestTable[requestId].player = _player;
      //if game simulation request
    } else if (_requestType == 2) {
      s_RequestTable[requestId].requestType = RequestType.GameSimulation;
      s_RequestTable[requestId].challengeId = _challengeId;
    }
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    //get requestId Details
    if (s_RequestTable[requestId].requestType == RequestType.GameSimulation) {
      // trigger start game simulation
      handleGameSimulationTrigger(s_RequestTable[requestId].challengeId, randomWords);
    } else if (s_RequestTable[requestId].requestType == RequestType.LootBox) {
      // gives 50% chance of GK
      uint256 player1Index = randomWords[0] % 61;
      //send random numbers to nft contract
      i_NFT.openLootBox(player1Index, s_RequestTable[requestId].player);
      //Any of the base 700 odd players
      uint256 player2Index = randomWords[1] % 706;
      //send random numbers to nft contract
      i_NFT.openLootBox(player2Index, s_RequestTable[requestId].player);
      uint256 player3Index = randomWords[2] % 706;
      //send random numbers to nft contract
      i_NFT.openLootBox(player3Index, s_RequestTable[requestId].player);
      uint256 player4Index = randomWords[3] % 706;
      //send random numbers to nft contract
      i_NFT.openLootBox(player4Index, s_RequestTable[requestId].player);
      uint256 player5Index = randomWords[4] % 706;
      //send random numbers to nft contract
      i_NFT.openLootBox(player5Index, s_RequestTable[requestId].player);
      emit PackOpened(
        s_RequestTable[requestId].player,
        player1Index,
        player2Index,
        player3Index,
        player4Index,
        player5Index
      );
    }
  }

  //handleLootBox Logic
  function handleLootBoxLogic(uint256 _randomNumber, address _player) internal {
    //TODO add logic here to get to the random player index
    uint256 playerIndex = _randomNumber % 706;
    //send random numbers to nft contract
    i_NFT.openLootBox(playerIndex, _player);
  }

  function handleGameSimulationTrigger(uint256 _gameId, uint256[] memory _randomWords) internal {
    //create an array of strings and send to consumer contract
    string[] memory requestArguments = new string[](_randomWords.length + 1);
    requestArguments[0] = Strings.toString(_gameId);

    for (uint8 i = 1; i < _randomWords.length; i++) {
      requestArguments[i] = Strings.toString(_randomWords[i]);
    }
    i_Consumer.sendRequest(requestArguments);
  }

  // set functions consumer address
  function setFunctionsConsumerAddress(address _consumerAddress) external onlyAdmin(msg.sender) {
    i_Consumer = CB_ConsumerInterface(_consumerAddress);
  }
  // set NFT address
  function setNFTAddress(address _nftAddress) external onlyAdmin(msg.sender) {
    i_NFT = CB_NFTInterface(_nftAddress);
  }
  // set game address
  function setMatchManagerAddress(address _matchManagerAddress) external onlyAdmin(msg.sender) {
    i_MatchManager = CB_MatchManagerInterface(_matchManagerAddress);
  }
}
