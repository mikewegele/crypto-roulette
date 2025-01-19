import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "./contractABI.json";
import "./App.css";

const CONTRACT_ADDRESS = "YOUR_ADDRESS";

const App = () => {
  const [account, setAccount] = useState("");
  const [bets, setBets] = useState([]);
  const [number, setNumber] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [winningNumber, setWinningNumber] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const rouletteContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        setContract(rouletteContract);

        const contractBalance = await web3.eth.getBalance(CONTRACT_ADDRESS);
        setBalance(web3.utils.fromWei(contractBalance, "ether"));
      } else {
        alert("Please install MetaMask!");
      }
    };
    initWeb3();
  }, []);

  const placeBet = async () => {
    if (!contract || !number) return;
    try {
      const value = Web3.utils.toWei("0.01", "ether");
      await contract.methods.placeBet(Number(number)).send({
        from: account,
        value,
      });
      alert("Bet placed!");
    } catch (error) {
      console.error(error);
    }
  };

  const startGame = async () => {
    if (!contract) return;
    try {
      await contract.methods.startGame().send({ from: account });
      alert("Game started!");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWinningNumber = async () => {
    if (!contract) return;
    try {
      const result = await contract.methods.winningNumber().call();
      setWinningNumber(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Ethereum Roulette</h1>
          <p>Contract Balance: {balance} ETH</p>
          <p>Your Address: {account}</p>
          <input
              type="number"
              placeholder="Number (0-36)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
          />
          <button onClick={placeBet}>Place Bet</button>
          <button onClick={startGame}>Start Game</button>
          <button onClick={fetchWinningNumber}>Show Winning Number</button>
          {winningNumber !== null && <p>Winning Number: {winningNumber}</p>}
        </header>
      </div>
  );
};

export default App;
