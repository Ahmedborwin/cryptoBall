//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
//import {console} from "hardhat/console.sol";

contract CBNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  using Strings for uint256;
  //Modifiers
  modifier onlyAdmin() {
    require(
      msg.sender == VRF_RequestHandler || msg.sender == contract_Admin || msg.sender == MatchManager,
      "Only Contract Admins Can Make This Call"
    );
    _;
  }

  //variables
  uint8 public s_tokenCounter;
  mapping(uint256 => string) private _tokenURIs;
  mapping(uint256 => uint8[4]) public tokenUpgrades;
  mapping(uint256 => uint256) public tokenIdToURIIndex;
  mapping(address => mapping(uint256 => bool)) public isTokenOwnedByAddress;
  //0 = attacking
  //1 = defending
  //2 = midfield
  //3 = goalkeeping
  string public s_CB_BaseURI;
  bool private s_initialized;

  //Admins
  address internal VRF_RequestHandler;
  address internal contract_Admin;
  address internal MatchManager;

  function setMatchManager(address _matchManager) public onlyAdmin {
    MatchManager = _matchManager;
  }

  //All NFT's to address storage mapping
  mapping(address => string[]) public s_addressToAllTokenURIs;

  event NFTMinted(address player, string tokenURI);
  event LootBoxOpened(address player, string tokenURI);

  constructor(string memory _baseHash, address _contractAdmin) ERC721("CB_PLAYERS", "CBNFT") {
    s_tokenCounter = 1;
    s_CB_BaseURI = _baseHash;
    contract_Admin = _contractAdmin;
    MatchManager = _contractAdmin;
  }

  function modifyUpgrade(uint256 _tokenID, uint8[4] memory _newValues) public onlyAdmin {
    tokenUpgrades[_tokenID] = _newValues;
  }

  function minNFT(uint256 _uriIndex, address _player) external onlyAdmin {
    uint8 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;

    //Mint NFT and set the TokenURI
    _safeMint(_player, _tokenCounter);

    string memory playerURI = tokenURI(_tokenCounter, _uriIndex);

    _setTokenURI(_tokenCounter, playerURI);
    _tokenURIs[s_tokenCounter] = playerURI; //set tokenURI to mapping

    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[_player].push(playerURI);
    isTokenOwnedByAddress[msg.sender][s_tokenCounter] = true;
    // //emit event
    emit NFTMinted(_player, playerURI);
  }

  function openLootBox(uint256 _uriIndex, address _player) external onlyAdmin {
    uint8 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;

    //Mint NFT and set the TokenURI
    _safeMint(_player, _tokenCounter);

    string memory playerURI = tokenURI(_tokenCounter, _uriIndex);

    tokenIdToURIIndex[_tokenCounter] = _uriIndex;

    _setTokenURI(_tokenCounter, playerURI);
    _tokenURIs[s_tokenCounter] = playerURI; //set tokenURI to mapping

    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[_player].push(playerURI);
    isTokenOwnedByAddress[msg.sender][s_tokenCounter] = true;
    // //emit event
    emit LootBoxOpened(_player, playerURI);
  }

  function updateTokenURI(uint8 _tokenID, string calldata _newURI) external onlyOwner {
    _setTokenURI(_tokenID, _newURI);
  }

  //Helper Functions

  function uintToString(uint256 value) internal pure returns (string memory) {
    return Strings.toString(value);
  }

  function setVRFHandlerAddress(address _vrfHandler) external onlyAdmin {
    VRF_RequestHandler = _vrfHandler;
  }

  function populateBaseHash(string calldata _baseHash) external onlyAdmin {
    s_CB_BaseURI = _baseHash;
  }

  function _baseURI() internal view override returns (string memory) {
    return s_CB_BaseURI;
  }

  function isNFTOwner(address _player, uint256 tokenId) external view returns (bool) {
    if (_player == ownerOf(tokenId)) {
      return true;
    } else {
      return false;
    }
  }

  //getter functions

  function getTokenURIByAddress(address _address) external view returns (string[] memory) {
    return s_addressToAllTokenURIs[_address];
  }

  function tokenURI(uint256 tokenId, uint256 _URIIndex) public view returns (string memory) {
    _requireMinted(tokenId);
    string memory baseURI = _baseURI();
    return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _URIIndex.toString(), ".json")) : "";
  }

  function getTokenUriFromTokenId(uint256 tokenId) external view returns (string memory) {
    return _tokenURIs[tokenId];
  }

  function getBasePlayerIndexFromId(uint256 _tokenId) external view returns (uint256) {
    return tokenIdToURIIndex[_tokenId];
  }
}
