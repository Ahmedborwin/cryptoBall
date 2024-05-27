//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CB_NFTInterface {
  function openLootBox(uint256 tokenUriIndex, address player) external;

  //check NFT owned by Address
  function isNFTOwner(address _player, uint256 tokenId) external returns (bool);

  function getTokenUriFromTokenId(uint256 tokenId) external view returns (string memory);

  function getBasePlayerIndexFromId(uint256 _tokenId) external view returns (uint256);

  function getTokenUpgradeValue(uint256 _tokenId, uint8 _attribute) external returns (uint8);

  function modifyUpgrade(uint256 _tokenID, uint8 _attribute, uint8 _newValue) external;

  function getIsNFTListed(uint256 _tokenId) external view returns (bool);
}
