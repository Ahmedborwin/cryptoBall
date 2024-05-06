//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

error cryptoBall__Calleris0Address();
error cryptoBall__UsernameTaken();
error cryptoBall__RegisteredPlayer();

/**
 * @title CRYPTOBALL
 */

contract CRYPTOBALL {
  modifier is0Address(address _caller) {
    if (_caller == address(0)) {
      revert cryptoBall__Calleris0Address();
    }
    _;
  }

  //variables
  //Mappings
  mapping(address => ManagerProfile) public managerTable;
  mapping(string => bool) public isUsernameFound;
  mapping(address => bool) public isRegisteredPlayer;

  //structs
  struct ManagerProfile {
    string name;
    uint8[] stakedPlayers;
    uint8 wins;
    uint8 losses;
    uint8 goalsScored;
    uint8 goalsConceded;
  }

  ManagerProfile managerProfile;

  //events
  event ManagerProfileCreated(address managerAddress, string teamName);

  constructor() {}

  //create team profile
  function createTeamProfile(string memory _teamName) external is0Address(msg.sender) {
    //check player not registered
    if (isRegisteredPlayer[msg.sender]) {
      revert cryptoBall__RegisteredPlayer();
    }
    //check username not already taken
    if (isUsernameFound[_teamName]) {
      revert cryptoBall__UsernameTaken();
    }
    managerProfile.name = _teamName;
    managerTable[msg.sender] = managerProfile;
    //TODO:send new manager tokens
    emit ManagerProfileCreated(msg.sender, _teamName);
  }

  //stake team
  function stakePlayerNFTs(uint8[] calldata _playerTokenIds) external {
    managerProfile.stakedPlayers = _playerTokenIds;
    managerTable[msg.sender] = managerProfile;
  }
  //create challenge
  //accept challenge
  //start challenge
}
