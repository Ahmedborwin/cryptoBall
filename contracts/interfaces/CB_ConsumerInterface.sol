//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CB_ConsumerInterface {
  function requestRandomNumber(
    uint8 _requestType,
    address _player,
    uint256 _challengeId,
    uint32 _randomNumbersReq
  ) external returns (uint256 requestId);
}
