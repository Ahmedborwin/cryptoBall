//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "hardhat/console.sol";

error CBNFT__AlreadyInitialized();

contract CBNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(_caller == VRF_RequestHandler || _caller == contract_Admin, "Only Conract Admins Can Make This Call");
    _;
  }

  //variables
  uint8 private s_tokenCounter;
  string[] internal s_BallURIs;
  string s_CB_BaseURI;
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

  function minNFT(uint8 _uriIndex, address _player) external onlyAdmin(msg.sender) {
    uint8 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;
    //Mint NFT and set the TokenURI
    _safeMint(_player, _tokenCounter);
    //TODO how to create URI based on the players index here??
    string memory playerURI = s_CB_BaseURI;
    _setTokenURI(_tokenCounter, s_BallURIs[_uriIndex]);
    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[msg.sender].push(playerURI);
    // //emit event
    emit NFTMinted(_player, playerURI);
  }

  function updateTokenURI(uint8 _tokenID, string calldata _newURI) external onlyOwner {
    _setTokenURI(_tokenID, _newURI);
  }

  //getter functions

  function getTokenURIByAddress(address _address) external view returns (string[] memory) {
    return s_addressToAllTokenURIs[_address];
  }

  function setVRFHandlerAddress(address _vrfHandler) external onlyAdmin(msg.sender) {
    VRF_RequestHandler = _vrfHandler;
  }
}
