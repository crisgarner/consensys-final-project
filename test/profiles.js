var BN = web3.utils.BN;
require("chai").should();
require("chai").use(require("chai-bignumber")(BN));

const Profiles = artifacts.require("./Profiles.sol");

contract("Profiles", accounts => {
  beforeEach(async () => {
    this.instance = await Profiles.deployed(accounts[0]);
  });

  it("...should create an user profile.", async () => {
    var receipt = await this.instance.createProfile(
      web3.utils.utf8ToHex("Cristian Espinoza"),
      web3.utils.utf8ToHex("Male"),
      28,
      "Building the Coffee Economy on the Blockchain @ Affogato Network.",
      "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
      { from: accounts[1] }
    );
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogCreateProfile",
      "should be the LogCreateProfile event"
    );
    receipt.logs[0].args._owner.should.equal(
      accounts[1],
      "should equal to inserted"
    );
    expect(web3.utils.hexToUtf8(receipt.logs[0].args._name)).to.equal(
      "Cristian Espinoza",
      "should equal to inserted"
    );
    expect(web3.utils.hexToUtf8(receipt.logs[0].args._sex)).to.equal(
      "Male",
      "should equal to inserted"
    );
    receipt.logs[0].args._age
      .toNumber()
      .should.equal(28, "should equal to inserted");
    receipt.logs[0].args._bio.should.equal(
      "Building the Coffee Economy on the Blockchain @ Affogato Network.",
      "should equal to inserted"
    );

    receipt.logs[0].args._imageHash.should.equal(
      "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
      "should equal to inserted"
    );

    var revert = false;
    try {
      await this.instance.createProfile(
        web3.utils.utf8ToHex("Eduardo Espinoza"),
        web3.utils.utf8ToHex("Male"),
        30,
        "Building the Coffee Economy on the Blockchain @ Affogato Network.",
        "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
        { from: accounts[1] }
      );
    } catch (err) {
      revert = true;
      assert(err.reason === "User already has an account");
    }
    expect(revert).to.equal(true, "Should revert on existing profile creation");
    const size = await this.instance.getCurrentProfilesSize();
    size.toNumber().should.be.equal(1);
  });

  it("...should get an user profile.", async () => {
    var profile = await this.instance.addressToProfile(accounts[1]);
    profile.owner.should.be.equal(accounts[1]);
    expect(web3.utils.hexToUtf8(profile.name)).to.equal("Cristian Espinoza");
    expect(web3.utils.hexToUtf8(profile.sex)).to.equal("Male");
    profile.age.toNumber().should.be.equal(28);
    profile.bio.should.be.equal(
      "Building the Coffee Economy on the Blockchain @ Affogato Network."
    );
    profile.imageHash.should.be.equal(
      "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu"
    );
  });

  it("...should update an user profile.", async () => {
    var receipt = await this.instance.updateProfile(
      web3.utils.utf8ToHex("Eduardo Espinoza"),
      web3.utils.utf8ToHex("Male"),
      32,
      "Building the Coffee Economy on the Blockchain @ Affogato Network.",
      "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
      { from: accounts[1] }
    );
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogUpdateProfile",
      "should be the LogUpdateProfile event"
    );
    receipt.logs[0].args._owner.should.equal(
      accounts[1],
      "should equal to updated"
    );
    expect(web3.utils.hexToUtf8(receipt.logs[0].args._name)).to.equal(
      "Eduardo Espinoza",
      "should equal to updated"
    );
    expect(web3.utils.hexToUtf8(receipt.logs[0].args._sex)).to.equal(
      "Male",
      "should equal to updated"
    );
    receipt.logs[0].args._age
      .toNumber()
      .should.equal(32, "should equal to updated");
    receipt.logs[0].args._bio.should.equal(
      "Building the Coffee Economy on the Blockchain @ Affogato Network.",
      "should equal to updated"
    );

    var revert = false;
    try {
      await this.instance.updateProfile(
        web3.utils.utf8ToHex("Eduardo Garner"),
        web3.utils.utf8ToHex("Male"),
        40,
        "Building the Coffee Economy on the Blockchain @ Affogato Network.",
        "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
        { from: accounts[5] }
      );
    } catch (err) {
      revert = true;
      assert(err.reason === "User do not has an account");
    }
    const size = await this.instance.getCurrentProfilesSize();
    size.toNumber().should.be.equal(1);
    expect(revert).to.equal(
      true,
      "Should revert on non existing profile update"
    );
  });

  it("...should set an owner.", async () => {
    var owner = await this.instance.owner();
    owner.should.be.equal(accounts[0]);
  });
});
