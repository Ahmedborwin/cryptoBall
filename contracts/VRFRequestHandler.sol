//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {CB_NFTInterface} from "contracts/interfaces/CB_NFTInterface.sol";

contract VRFRequestHandler is VRFConsumerBaseV2Plus {
  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(_caller == contract_Admin, "Only Contract Admins Can Make This Call");
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
  uint256 private immutable s_subscriptionId;
  bytes32 private immutable s_gasLane;
  uint32 private immutable s_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;

  //initialise structs
  RequestDetails requestDetails;
  //Interfaces
  CB_NFTInterface i_NFT;
  //admin
  address contract_Admin;

  constructor(
    address vrfCoordinatorV2,
    uint256 subscriptionId,
    bytes32 gasLane, // keyHash
    uint32 callbackGasLimit,
    address _CBNFTAddress,
    address _contract_Admin
  ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
    i_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinatorV2);
    s_gasLane = gasLane;
    s_subscriptionId = subscriptionId;
    s_callbackGasLimit = callbackGasLimit;
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
    } else if (s_RequestTable[requestId].requestType == RequestType.LootBox) {
      //TODO: is there a better way to do this?
      handleLootBoxLogic(randomWords[0], s_RequestTable[requestId].player);
      handleLootBoxLogic(randomWords[1], s_RequestTable[requestId].player);
      handleLootBoxLogic(randomWords[2], s_RequestTable[requestId].player);
      handleLootBoxLogic(randomWords[3], s_RequestTable[requestId].player);
      handleLootBoxLogic(randomWords[4], s_RequestTable[requestId].player);
    } else {
      //event here to deal with edge case?
    }
  }

  //handleLootBox Logic
  function handleLootBoxLogic(uint256 _randomNumber, address _player) public {
    //TODO add logic here to get to the random player index
    uint256 playerIndex = _randomNumber % 1000;
    //send random numbers to nft contract
    i_NFT.openLootBox(playerIndex, _player);
  }

  //TODO: set cooridnator address
  //TODO: set NFT address
  //TODO: set game address
}
