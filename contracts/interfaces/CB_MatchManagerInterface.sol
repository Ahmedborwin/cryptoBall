//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CB_MatchManagerInterface {
  //need entry function to finalise game. Should be called by consumer contract
  function finalizeGame(bytes memory buffer) external;

  function getIsNFTStaked(uint256 _tokenId) external view returns (address);
}
