module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Your Ganache host (usually localhost)
      port: 7545,      // Your Ganache port (usually 7545)
      network_id: "*"   // Replace 5777 with the *exact* Network ID from Ganache UI
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Or the specific Solidity version you are using
    }
  }
};