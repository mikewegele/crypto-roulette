// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    struct Bets {
        string time;
        string nickname;
        string bet;
        string value;
        string amount;
    }

    string[] public users;
    string[] public ready;
    Bets[] public bets;


    function register(string memory _nickname) public {

        users.push(_nickname);

    }

    function getUsers() public view returns (string[] memory) {
        return users;
    }
        
    function logout(string memory _value) public {
        // Iterate through the array to find the element
        for (uint256 i = 0; i < users.length; i++) {
            // Compare the strings using keccak256 hash
            if (keccak256(abi.encodePacked(users[i])) == keccak256(abi.encodePacked(_value))) {
                // If the element is found, swap it with the last element
                if (i != users.length - 1) {
                    users[i] = users[users.length - 1];
                }
                // Remove the last element
                users.pop();
                return; // Exit the function after removing the element
            }
        }

        for (uint256 i = 0; i < ready.length; i++) {
            // Compare the strings using keccak256 hash
            if (keccak256(abi.encodePacked(ready[i])) == keccak256(abi.encodePacked(_value))) {
                // If the element is found, swap it with the last element
                if (i != ready.length - 1) {
                    ready[i] = ready[ready.length - 1];
                }
                // Remove the last element
                ready.pop();
                return; // Exit the function after removing the element
            }
        }

        revert("Element not found in array");
    }

    function addBet(string memory _time, string memory _nickname, string memory _bet, string memory _value, string memory _amount) public {

        bets.push(Bets(_time,_nickname,_bet,_value,_amount));

    }

    function getBets() public view returns (Bets[] memory) {
        return bets;
    }

    function addReadyUser(string memory _nickname) public {

        ready.push(_nickname);

        // check if users length don't equal 1 
        // check if users length equal ready length
        // if users.length !== 1 and users.length !== ready.length : generate the Winner otherwise wait for all users to be ready

    }

    function getReady() public view returns (string[] memory) {
        return ready;
    }

}