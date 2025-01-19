// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract SecureRoulette is VRFConsumerBase {
    struct Bet {
        address player;
        uint amount;
        uint8 number; // Zahl zwischen 0-36
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
        keyHash = 0xAA77729D3466CA35AE8D28B7EC64358D9A79289A0A32EC1CF7F8ACB9F5A9E134; // KeyHash für Chainlink
        fee = 0.1 * 10 ** 18; // LINK-Gebühr
    }

    // Spieler platziert Einsatz
    function placeBet(uint8 _number) public payable {
        require(gameActive, "Das Spiel ist nicht aktiv.");
        require(msg.value >= minBet && msg.value <= maxBet, "Einsatz liegt nicht im erlaubten Bereich.");
        require(_number <= 36, "Zahl muss zwischen 0 und 36 liegen.");
        require(bets.length < maxPlayers, "Maximale Spieleranzahl erreicht.");

        bets.push(Bet(msg.sender, msg.value, _number));
        totalBetAmount += msg.value;

        emit BetPlaced(msg.sender, msg.value, _number);
    }

    // Startet das Spiel und fordert eine Zufallszahl an
    function startGame() public onlyOwner {
        require(gameActive, "Das Spiel ist nicht aktiv.");
        require(bets.length > 0, "Keine Einsätze vorhanden.");
        require(LINK.balanceOf(address(this)) >= fee, "Nicht genügend LINK für Zufallszahl.");

        gameActive = false; // Deaktiviert das Spiel bis zur Ziehung
        emit GameStarted();
        requestRandomness(keyHash, fee);
    }

    // Verarbeitet die Zufallszahl und ermittelt den Gewinner
    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        winningNumber = uint8(randomness % 37); // Zahl zwischen 0-36
        emit GameEnded(winningNumber);
        distributePayouts(winningNumber);
    }

    // Auszahlung an die Gewinner
    function distributePayouts(uint8 _winningNumber) internal {
        uint payoutAmount = 0;

        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].number == _winningNumber) {
                payoutAmount = bets[i].amount * 36; // 36-facher Gewinn
                address winner = bets[i].player;

                // Auszahlung durchführen
                (bool success, ) = winner.call{value: payoutAmount}("");
                require(success, "Auszahlung fehlgeschlagen.");

                emit Payout(winner, payoutAmount);
            }
        }

        // Rücksetzen des Spiels
        delete bets;
        totalBetAmount = 0;
        gameActive = true; // Spiel wieder aktivieren
    }

    // Beendet das Spiel und zahlt verbleibendes Guthaben an den Besitzer aus
    function endGame() public onlyOwner {
        require(!gameActive, "Spiel muss beendet sein.");
        gameActive = false;

        // Auszahlung des gesamten Vertragsguthabens an den Besitzer
        payable(owner).transfer(address(this).balance);
    }

    // Modifikator für den Besitzer
    modifier onlyOwner() {
        require(msg.sender == owner, "Nur der Besitzer kann diese Funktion ausführen.");
        _;
    }

    // Erlaubt Einzahlung von LINK-Token
    function fundLINK() public payable onlyOwner {
        require(msg.value > 0, "Es muss ein Betrag eingezahlt werden.");
    }

    // Rückgabefunktion für Ether
    receive() external payable {
        totalBetAmount += msg.value;
    }
}
