// migrations/2_deploy_contracts.js
const MyContract = artifacts.require("MyContract");

module.exports = function (deployer) {
  deployer.deploy(MyContract);
};