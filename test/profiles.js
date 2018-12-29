const Profiles = artifacts.require("./Profiles.sol");

contract("Profiles", accounts => {
  it("...should store a profile.", async () => {
    const instance = await Profiles.deployed();
  });
});
