// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {CB_MatchManagerInterface} from "contracts/interfaces/CB_MatchManagerInterface.sol";
/**
 * @title Chainlink Functions example on-demand consumer contract example
 */
contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
  using FunctionsRequest for FunctionsRequest.Request;

  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(_caller == contract_Admin || _caller == address(i_MatchManager), "Only Contract Admins Can Make This Call");
    _;
  }

  bytes32 public donId; // DON ID for the Functions DON to which the requests are sent

  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

  //Game Variables
  //game Engine JS Code
  string internal gameEngine;
  uint64 internal subscriptionId;
  uint32 internal callbackGasLimit;

  //Interfaces
  CB_MatchManagerInterface i_MatchManager;

  //Admin
  address contract_Admin;

  //EVENTS
  event ResponseReceived(bytes32 _requestId, bytes _response);

  constructor(
    address router,
    bytes32 _donId,
    address _matchManagerAddress,
    address _contract_Admin
  ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    donId = _donId;
    i_MatchManager = CB_MatchManagerInterface(_matchManagerAddress);
    contract_Admin = _contract_Admin;
  }
  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }

  function sendRequest(string[] calldata args) external {
    //external call without modifier to be called through interface
    _internalSendRequest(args, msg.sender);
  }

  /**
   * @notice Triggers an on-demand Functions request using remote encrypted secrets
   * @param args String arguments passed into the source code and accessible via the global variable `args`
   */
  function _internalSendRequest(string[] calldata args, address _caller) internal onlyAdmin(_caller) {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, gameEngine);
    if (args.length > 0) {
      req.setArgs(args);
    }
    s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, donId);
  }

  /**
   * @notice Store latest result/error
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    s_lastResponse = response;
    s_lastError = err;
    if (response.length > 0) {
      emit ResponseReceived(requestId, response);
    }
  }

  //UTIL FUNCTIONS

  function populateGameEngine(string calldata _gameEngine) external onlyOwner {
    gameEngine = _gameEngine;
  }
  function populateSubIdANDGasLimit(uint64 _subId, uint32 _callbackGasLimit) external onlyOwner {
    subscriptionId = _subId;
    callbackGasLimit = _callbackGasLimit;
  }

  //Setter Functions
  function setMatchManagerAddress(address _matchManagerAddress) external onlyAdmin(msg.sender) {
    i_MatchManager = CB_MatchManagerInterface(_matchManagerAddress);
  }

  function setContractAdmin(address _newAdmin) external onlyAdmin(msg.sender) {
    contract_Admin = _newAdmin;
  }
}
