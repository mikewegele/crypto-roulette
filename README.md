Here's a short README on how to start the program:

---

# Ethereum Roulette

This is a decentralized Ethereum Roulette game, built using Solidity, Hardhat, Web3.js, and React. The smart contract interacts with MetaMask for user wallet management and contract interactions.

## Requirements

- Node.js (v16.x or higher)
- npm or yarn
- MetaMask browser extension

## Setup

### 1. Install dependencies

In the project root, install the necessary packages for both the frontend and smart contract:

#### Install dependencies

```bash
npm install
```

### 2. Compile the smart contract

Compile the smart contract using Hardhat:

```bash
npx hardhat compile
```

### 3. Deploy the smart contract

Deploy the smart contract to a network (e.g., Hardhat Network or Rinkeby) using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

### 4. Set up MetaMask

- Install the [MetaMask](https://metamask.io) extension in your browser.
- Create an Ethereum wallet or import an existing one.
- Add the network you used in your Hardhat config (e.g., Rinkeby or the local Hardhat network).
- Connect MetaMask to your app.

### 5. Run the frontend

After the smart contract is deployed and MetaMask is set up, navigate to the frontend folder and start the React application:

```bash
npm start
```

This will start the React app on `http://localhost:3000`.

### 6. Interact with the game

- In the React frontend, you can connect your MetaMask wallet by logging in with your Ethereum account.
- Place your bets by choosing a number (0-36) and clicking "Place Bet".
- Start the game and view the winning number.
