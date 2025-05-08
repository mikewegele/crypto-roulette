import Web3 from 'web3';
import MyContract from '../utils/MyContract.json'; // Import contract ABI

const web3 = new Web3(window.ethereum); // Use MetaMask or other provider

const getContractInstance = async () => {
  try {


    await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
    const networkId = await web3.eth.net.getId();  //Get network ID
    console.log(networkId);
    const deployedNetwork = MyContract.networks[networkId]; //Use network ID to get correct deployment



    if (deployedNetwork) {
      const contract = new web3.eth.Contract(
          MyContract.abi,
        deployedNetwork.address
      );
      return contract;
    } else {
      console.error("Contract not deployed on the current network");
      return null;
    }
  } catch (error) {
    console.error("Error getting contract instance:", error);
    return null;
  }
};

export { web3, getContractInstance };