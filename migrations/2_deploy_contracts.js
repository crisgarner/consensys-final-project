var Profiles = artifacts.require("./Profiles.sol");

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();
  await deployer.deploy(Profiles, accounts[0]);
};
