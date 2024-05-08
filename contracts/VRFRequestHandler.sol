//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "contracts/interfaces/CB_NFTInterface.sol";

contract VRFRequestHandler is VRFConsumerBaseV2 {
  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(_caller == contract_Admin, "Only Conract Admins Can Make This Call");
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

  // Chainlink VRF Variables
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;

  //initialise structs
  RequestDetails requestDetails;

  //Interfaces
  CB_NFTInterface i_NFT;

  //admin
  address contract_Admin;

  constructor(
    address vrfCoordinatorV2,
    uint64 subscriptionId,
    bytes32 gasLane, // keyHash
    uint32 callbackGasLimit,
    address _CBNFTAddress,
    address _contract_Admin
  ) VRFConsumerBaseV2(vrfCoordinatorV2) {
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_gasLane = gasLane;
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;
    i_NFT = CB_NFTInterface(_CBNFTAddress);
    contract_Admin = _contract_Admin;
  }

  function requestRandomNumber(
    uint8 _requestType,
    address _player,
    uint256 _challengeId,
    uint32 _randomNumbersReq
  ) public returns (uint256 requestId) {
    requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      _randomNumbersReq
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
    } else if (s_RequestTable[requestId].requestType == RequestType.LootBox) {
      handleLootBoxLogic(randomWords[0], s_RequestTable[requestId].player);
    } else {
      //event here to deal with edge case?
    }
  }

  //handleLootBox Logic
  function handleLootBoxLogic(uint256 _randomNumber, address _player) internal {
    //TODO add logic here to get to the random player index
    uint256 playerIndex = _randomNumber % 1000;
    //send random numbers to nft contract
    i_NFT.minNFT(playerIndex, _player);
  }
}
