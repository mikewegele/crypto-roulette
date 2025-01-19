// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";

contract SecureRoulette is VRFConsumerBase {
    struct Bet {
        address player;
        uint amount;
        uint8 number; // Number between 0-36
    }

    Bet[] public bets;
    address public owner;
    uint public totalBetAmount;
    bool public gameActive;
    uint public minBet = 0.01 ether;
    uint public maxBet = 1 ether;
    uint public maxPlayers = 100;
    uint8 public winningNumber;

    bytes32 internal keyHash;
    uint256 internal fee;

    // Events
    event BetPlaced(address indexed player, uint amount, uint8 number);
    event Payout(address indexed winner, uint amount);
    event GameStarted();
    event GameEnded(uint8 winningNumber);

    constructor()
    VRFConsumerBase(
    0x514910771AF9Ca656af840dff83E8264EcF986CA, // VRF Coordinator
    0x514910771AF9Ca656af840dff83E8264EcF986CA  // LINK Token
    )
    {
        owner = msg.sender;
        gameActive = true;
        keyHash = 0xAA77729D3466CA35AE8D28B7EC64358D9A79289A0A32EC1CF7F8ACB9F5A9E134; // KeyHash for Chainlink
        fee = 0.1 * 10 ** 18; // LINK fee
    }

    // Player places a bet
    function placeBet(uint8 _number) public payable {
        require(gameActive, "The game is not active.");
        require(msg.value >= minBet && msg.value <= maxBet, "Bet is out of allowed range.");
        require(_number <= 36, "Number must be between 0 and 36.");
        require(bets.length < maxPlayers, "Maximum player count reached.");

        bets.push(Bet(msg.sender, msg.value, _number));
        totalBetAmount += msg.value;

        emit BetPlaced(msg.sender, msg.value, _number);
    }

    // Starts the game and requests a random number
    function startGame() public onlyOwner {
        require(gameActive, "The game is not active.");
        require(bets.length > 0, "No bets placed.");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK for randomness.");

        gameActive = false; // Deactivates the game until the draw
        emit GameStarted();
        requestRandomness(keyHash, fee);
    }

    // Processes the random number and determines the winner
    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        winningNumber = uint8(randomness % 37); // Number between 0-36
        emit GameEnded(winningNumber);
        distributePayouts(winningNumber);
    }

    // Distributes payouts to the winners
    function distributePayouts(uint8 _winningNumber) internal {
        uint payoutAmount = 0;

        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].number == _winningNumber) {
                payoutAmount = bets[i].amount * 36; // 36x payout
                address winner = bets[i].player;

                // Perform payout
                (bool success, ) = winner.call{value: payoutAmount}("");
                require(success, "Payout failed.");

                emit Payout(winner, payoutAmount);
            }
        }

        // Reset the game
        delete bets;
        totalBetAmount = 0;
        gameActive = true; // Reactivate the game
    }

    // Ends the game and transfers remaining balance to the owner
    function endGame() public onlyOwner {
        require(!gameActive, "Game must be ended.");
        gameActive = false;

        // Transfer the entire contract balance to the owner
        payable(owner).transfer(address(this).balance);
    }

    // Modifier for the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function.");
        _;
    }

    // Allows deposit of LINK tokens
    function fundLINK() public payable onlyOwner {
        require(msg.value > 0, "A deposit must be made.");
    }

    // Fallback function for receiving Ether
    receive() external payable {
        totalBetAmount += msg.value;
    }
}
