var Profiles = artifacts.require("./Profiles.sol");

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();
  console.log("Migration account");
  console.log(accounts[0]);
  await deployer.deploy(Profiles, accounts[0]);
};
