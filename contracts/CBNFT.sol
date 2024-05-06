//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "hardhat/console.sol";

error CBNFT__AlreadyInitialized();

contract CBNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  //variables
  uint8 private s_tokenCounter;
  string[] internal s_BallURIs;
  bool private s_initialized;

  //NFT to address storage mapping
  mapping(address => mapping(uint256 => string)) public s_addressToTokenURI;
  //All NFT's to address storage mapping
  mapping(address => string[]) public s_addressToAllTokenURIs;

  constructor(string[] memory _tokenURIs) ERC721("CB_PLAYERS", "CBNFT") {
    s_tokenCounter = 1;
    _initializeTokenURIArray(_tokenURIs);
  }

  function _initializeTokenURIArray(string[] memory tokenUris) private {
    if (s_initialized) {
      revert CBNFT__AlreadyInitialized();
    }
    s_BallURIs = tokenUris;
    s_initialized = true;
  }

  function minNFT(uint8 _uriIndex) external {
    uint8 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;
    //Mint NFT and set the TokenURI
    _safeMint(msg.sender, _tokenCounter);
    _setTokenURI(_tokenCounter, s_BallURIs[_uriIndex]);
    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[msg.sender].push(s_BallURIs[_uriIndex]);
    // //emit event
    // emit nftMinted(_athlete, s_RunnerSeriesURI[uint256(nftWon)]);
  }

  function updateTokenURI(uint8 _tokenID, string calldata _newURI) external onlyOwner {
    _setTokenURI(_tokenID, _newURI);
  }

  //getter functions
  function getTokenURIArray() external view returns (string[] memory) {
    return s_BallURIs;
  }

  function getTokenURIByAddress(address _address) external view returns (string[] memory) {
    return s_addressToAllTokenURIs[_address];
  }
}
