// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    struct Bet {
        string time;
        string nickname;
        string bet;
        uint256 value;
        uint256 amount;
        address player;
    }

    string[] public users;
    string[] public ready;
    Bet[] public bets;
    mapping(address => uint256) public balances;
    uint256 public winningNumber;
    bool public gameActive;

    event BetPlaced(address indexed player, string betType, uint256 amount);
    event WinnerDeclared(uint256 winningNumber);
    event Payout(address indexed player, uint256 amount);

    function register(string memory _nickname) public {
        users.push(_nickname);
    }

    function getUsers() public view returns (string[] memory) {
        return users;
    }

    function logout(string memory _nickname) public {
        for (uint256 i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i])) == keccak256(abi.encodePacked(_nickname))) {
                users[i] = users[users.length - 1];
                users.pop();
                return;
            }
        }
        for (uint256 i = 0; i < ready.length; i++) {
            if (keccak256(abi.encodePacked(ready[i])) == keccak256(abi.encodePacked(_nickname))) {
                ready[i] = ready[ready.length - 1];
                ready.pop();
                return;
            }
        }
        revert("Nickname not found");
    }

    function addBet(
        string memory _time,
        string memory _nickname,
        string memory _bet,
        uint256 _value
    ) public payable {
        require(msg.value > 0, "Must bet some Ether");
        bets.push(Bet(_time, _nickname, _bet, _value, msg.value, msg.sender));
        balances[msg.sender] += msg.value;
        emit BetPlaced(msg.sender, _bet, msg.value);
    }

    function getBets() public view returns (Bet[] memory) {
        return bets;
    }

    function addReadyUser(string memory _nickname) public {
        ready.push(_nickname);

        if (users.length > 1 && users.length == ready.length) {
            generateWinningNumber();
        }
    }

    function getReady() public view returns (string[] memory) {
        return ready;
    }

    function generateWinningNumber() private {
        require(users.length > 1, "Not enough players");
        winningNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 37;
        gameActive = false;
        emit WinnerDeclared(winningNumber);
        distributeWinnings();
    }

    function distributeWinnings() private {
        for (uint256 i = 0; i < bets.length; i++) {
            if (isWinningBet(bets[i])) {
                uint256 payout = bets[i].amount * 2;
                payable(bets[i].player).transfer(payout);
                emit Payout(bets[i].player, payout);
            }
        }
        delete bets;
        delete ready;
    }

    function isWinningBet(Bet memory _bet) private view returns (bool) {
        if (
            keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("plein")) &&
            _bet.value == winningNumber
        ) {
            return true;
        }
        if (
            keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("passe")) &&
            winningNumber >= 19 &&
            winningNumber <= 36
        ) {
            return true;
        }
        if (
            keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("manque")) &&
            winningNumber >= 1 &&
            winningNumber <= 18
        ) {
            return true;
        }
        return false;
    }
}
