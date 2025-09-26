// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZenSnake {
    uint256 public totalGames;
    struct Player {
        address playerAddress;
        uint256 timestamp;
    }
    Player[] public players;

    event GameStarted(address indexed player, uint256 timestamp);

    function startGame() external {
        totalGames++;
        players.push(Player(msg.sender, block.timestamp));
        emit GameStarted(msg.sender, block.timestamp);
    }

    function getTotalGames() external view returns (uint256) {
        return totalGames;
    }

    function getPlayers() external view returns (Player[] memory) {
        return players;
    }
}