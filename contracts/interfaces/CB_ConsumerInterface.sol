//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CB_ConsumerInterface {
  function sendRequest(string[] calldata args) external;
}
