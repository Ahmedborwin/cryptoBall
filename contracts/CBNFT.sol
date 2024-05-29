//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {CB_MatchManagerInterface} from "contracts/interfaces/CB_MatchManagerInterface.sol";
import {CB_VRFInterface} from "contracts/interfaces/CB_VRFInterface.sol";

//import {console} from "hardhat/console.sol";

contract CBNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  using Strings for uint256;
  //Modifiers
  modifier onlyAdmin(address _caller) {
    require(
      _caller == address(i_VRF) || _caller == contract_Admin || _caller == address(i_GameManager),
      "Only Contract Admins Can Make This Call"
    );
    _;
  }

  //variables
  uint256 public s_tokenCounter;
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

  //NFT Listing Variables
  struct Listing {
    bool isListed;
    uint256 price;
  }

  //All NFT's to address storage mapping
  mapping(address => string[]) public s_addressToAllTokenURIs;
  mapping(uint256 => Listing) nftListing;

  //Admins
  address public contract_Admin;
  //Interfaces
  CB_VRFInterface public i_VRF;
  CB_MatchManagerInterface public i_GameManager;

  event NFTMinted(address player, string tokenURI);
  event LootBoxOpened(address player, string tokenURI, uint256 uriIndex);
  event PlayerNFTListed(address seller, uint256 tokenId, uint256 price);
  event PlayerSold(uint256 tokenId, address seller, address buyer, uint256 price);

  constructor(string memory _baseHash, address _MatchManager) ERC721("CB_PLAYERS", "CBNFT") {
    s_tokenCounter = 1;
    s_CB_BaseURI = _baseHash;
    contract_Admin = msg.sender;
    i_GameManager = CB_MatchManagerInterface(_MatchManager);
  }

  function openLootBox(uint256 _uriIndex, address _player) external onlyAdmin(msg.sender) {
    uint256 _tokenCounter = s_tokenCounter;
    s_tokenCounter++;
    //Mint NFT and set the TokenURI
    _safeMint(_player, _tokenCounter);

    string memory playerURI = tokenURI(_tokenCounter, _uriIndex);

    tokenIdToURIIndex[_tokenCounter] = _uriIndex;

    _setTokenURI(_tokenCounter, playerURI);
    _tokenURIs[_tokenCounter] = playerURI; //set tokenURI to mapping

    // push new token URI to list of tokens owned by address
    s_addressToAllTokenURIs[_player].push(playerURI);
    isTokenOwnedByAddress[_player][_tokenCounter] = true;
    // //emit event
    emit LootBoxOpened(_player, playerURI, _uriIndex);
  }

  function updateTokenURI(uint8 _tokenID, string calldata _newURI) external onlyOwner {
    _setTokenURI(_tokenID, _newURI);
  }

  // Upgrade TokenIDs

  function modifyUpgrade(uint256 _tokenID, uint8 _attribute, uint8 _newValue) public {
    _modifyUpgrade(_tokenID, _attribute, _newValue, msg.sender);
  }

  function _modifyUpgrade(uint256 _tokenID, uint8 _attribute, uint8 _newValue, address _caller) internal {
    tokenUpgrades[_tokenID][_attribute] = _newValue;
  }

  //Function to List nft for sale
  function listPlayerNFT(uint256 _tokenId, uint256 _price) external {
    //check msg.sender is owner
    require(msg.sender == ownerOf(_tokenId), "Not NFT Owner");
    //check NFT is not staked on players team
    require(i_GameManager.getIsNFTStaked(_tokenId) == address(0), "NFT Staked");
    //record that NFT is now for sale
    nftListing[_tokenId] = Listing(true, _price * 1 ether);

    //TODO
    //Data structure to view List of NFTs for sale by address
    //data structure to view list of NFT for sale in general

    emit PlayerNFTListed(msg.sender, _tokenId, _price);
  }

  //function to buy NFT
  function buyPlayerNft(uint256 _tokenId) external payable {
    //Get token Owner
    address seller = ownerOf(_tokenId);
    // check buyer if not seller
    require(msg.sender != seller, "Buyer Cannot Also be The Seller");
    //check NFT is for sale
    require(nftListing[_tokenId].isListed, "Player Not For Sale");
    //Check msg.value => than price
    require(msg.value >= nftListing[_tokenId].price, "Amount offered is Lower than Asking Price");
    uint256 royalty = (msg.value / 100) * 5;
    (bool sent, ) = seller.call{value: (msg.value - royalty)}("");
    require(sent, "Transfer Failed");
    _transfer(seller, msg.sender, _tokenId);
    emit PlayerSold(_tokenId, seller, msg.sender, msg.value);
  }

  //-------------------------------------------------------------------
  //Internal Helper Functions

  function uintToString(uint256 value) internal pure returns (string memory) {
    return Strings.toString(value);
  }

  function populateBaseHash(string calldata _baseHash) external onlyAdmin(msg.sender) {
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

  //-------------------------------------------------------------------
  //Setter functions

  function setVRFHandlerAddress(address _vrfHandler) external onlyAdmin(msg.sender) {
    i_VRF = CB_VRFInterface(_vrfHandler);
  }
  function setMatchManager(address _matchManager) public onlyAdmin(msg.sender) {
    i_GameManager = CB_MatchManagerInterface(_matchManager);
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

  function getTokenUpgradeValue(uint256 _tokenId, uint8 _attribute) external view returns (uint8) {
    return tokenUpgrades[_tokenId][_attribute];
  }

  function getIsNFTListed(uint256 _tokenId) external view returns (bool) {
    return nftListing[_tokenId].isListed;
  }
}
