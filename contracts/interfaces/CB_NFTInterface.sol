//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CB_NFTInterface {
  function openLootBox(uint256 tokenUriIndex, address player) external;

  //check NFT owned by Address
  function isNFTOwner(address _player, uint256 tokenId) external returns (bool);
}
