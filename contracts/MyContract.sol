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

    // Speicher-Array (Storage)
    string[37] public colors;

    function setColors() public {
        string[37] memory tempColors;
        // Dynamisches Array im Memory mit 37 Werten
        tempColors[0] = "green";
        tempColors[1] = "red";
        tempColors[2] = "black";
        tempColors[3] = "red";
        tempColors[4] = "black";
        tempColors[5] = "red";
        tempColors[6] = "black";
        tempColors[7] = "red";
        tempColors[8] = "black";
        tempColors[9] = "red";
        tempColors[10] = "black";
        tempColors[11] = "black";
        tempColors[12] = "red";
        tempColors[13] = "black";
        tempColors[14] = "red";
        tempColors[15] = "black";
        tempColors[16] = "red";
        tempColors[17] = "black";
        tempColors[18] = "red";
        tempColors[19] = "red";
        tempColors[20] = "black";
        tempColors[21] = "red";
        tempColors[22] = "black";
        tempColors[23] = "red";
        tempColors[24] = "black";
        tempColors[25] = "red";
        tempColors[26] = "black";
        tempColors[27] = "red";
        tempColors[28] = "black";
        tempColors[29] = "black";
        tempColors[30] = "red";
        tempColors[31] = "black";
        tempColors[32] = "red";
        tempColors[33] = "black";
        tempColors[34] = "red";
        tempColors[35] = "black";
        tempColors[36] = "red";

        // Array von memory nach storage übertragen
        for (uint i = 0; i < 37; i++) {
            colors[i] = tempColors[i];
        }
    }



    // Stores the history of balances before and after payout
    mapping(address => uint256[]) public balanceHistory; // Maps user addresses to a history of balances

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
        uint256 _value,
        uint256 _amount
    ) public payable {
        require(msg.value > 0, "Must bet some Ether");
        bets.push(Bet(_time, _nickname, _bet, _value, _amount, msg.sender));
        balances[msg.sender] += _amount;
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

    function getWinningNumber() public view returns (uint256){
        return winningNumber;
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
            address player = bets[i].player;
            if (isWinningBet(bets[i])) {
                uint256 payout = calculatePayout(bets[i]);
                balances[player] += payout;
                payable(player).transfer(payout);
                emit Payout(player, payout);
            }
        }
        delete ready;
    }

    function isWinningBet(Bet memory _bet) private view returns (bool) {
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("plein")) && _bet.value == winningNumber) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("passe")) && winningNumber >= 19 && winningNumber <= 36) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("manque")) && winningNumber >= 1 && winningNumber <= 18) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("pair")) && winningNumber % 2 == 0 && winningNumber != 0) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("impair")) && winningNumber % 2 == 1) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("noir")) && keccak256(abi.encodePacked(colors[winningNumber])) == keccak256(abi.encodePacked("black"))) {
            return true;
        }
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("rouge")) && keccak256(abi.encodePacked(colors[winningNumber])) == keccak256(abi.encodePacked("red"))) {
            return true;
        }
        return false;
    }

    function calculatePayout(Bet memory _bet) private pure returns (uint256) {
        if (keccak256(abi.encodePacked(_bet.bet)) == keccak256(abi.encodePacked("plein"))) {
            return _bet.amount * 35;
        }
        return _bet.amount * 2; // Standard payout for other bet types
    }

    // Add a function to retrieve a player's balance history
    function getBalanceHistory(address _player) public view returns (uint256[] memory) {
        return balanceHistory[_player];
    }
}
