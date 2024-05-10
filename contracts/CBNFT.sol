//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import {console} from "hardhat/console.sol";

error CBNFT__AlreadyInitialized();

contract CBNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  using Strings for uint256;
  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(_caller == VRF_RequestHandler || _caller == contract_Admin, "Only Conract Admins Can Make This Call");
    _;
  }

  //variables
  uint8 public s_tokenCounter;
  string[] internal s_BallURIs;
  string public s_CB_BaseURI;
  bool private s_initialized;

  //Admins
  address internal VRF_RequestHandler;
  address internal contract_Admin;

  //All NFT's to address storage mapping
  mapping(address => string[]) public s_addressToAllTokenURIs;

  event NFTMinted(address player, string tokenURI);

  constructor(string[] memory _tokenURIs, address _contractAdmin) ERC721("CB_PLAYERS", "CBNFT") {
    s_tokenCounter = 1;
    _initializeTokenURIArray(_tokenURIs);
    contract_Admin = _contractAdmin;
  }

  function _initializeTokenURIArray(string[] memory tokenUris) private {
    if (s_initialized) {
      revert CBNFT__AlreadyInitialized();
    }
    s_BallURIs = tokenUris;
    s_initialized = true;
  }

  function minNFT(uint256 _uriIndex, address _player) external onlyAdmin(msg.sender) {
    uint8 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;

    //Mint NFT and set the TokenURI
    _safeMint(_player, _tokenCounter);

    string memory playerURI = tokenURI(_uriIndex);

    _setTokenURI(_tokenCounter, playerURI);

    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[_player].push(playerURI);
    // //emit event
    emit NFTMinted(_player, playerURI);
  }

  function updateTokenURI(uint8 _tokenID, string calldata _newURI) external onlyOwner {
    _setTokenURI(_tokenID, _newURI);
  }

  //Helper Functions

  function uintToString(uint256 value) internal pure returns (string memory) {
    return Strings.toString(value);
  }

  function setVRFHandlerAddress(address _vrfHandler) external onlyAdmin(msg.sender) {
    VRF_RequestHandler = _vrfHandler;
  }

  function populateBaseHash(string calldata _baseHash) external onlyAdmin(msg.sender) {
    s_CB_BaseURI = _baseHash;
  }

  function _baseURI() internal view override returns (string memory) {
    return s_CB_BaseURI;
  }

  //getter functions

  function getTokenURIByAddress(address _address) external view returns (string[] memory) {
    return s_addressToAllTokenURIs[_address];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireMinted(tokenId);
    string memory baseURI = _baseURI();
    return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
  }
}
