var BN = web3.utils.BN;
require("chai").should();
require("chai").use(require("chai-bignumber")(BN));

const Profiles = artifacts.require("./Profiles.sol");

contract("Profiles", accounts => {
  beforeEach(async () => {
    this.instance = await Profiles.deployed(accounts[0]);
  });

  it("...should set an owner.", async () => {
    var owner = await this.instance.owner();
    owner.should.be.equal(accounts[0]);
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

  it("...should return array of addresses.", async () => {
    var profiles = await this.instance.getProfiles();
    profiles.length.should.be.equal(1);
    await this.instance.createProfile(
      web3.utils.utf8ToHex("Lucy Aguilar"),
      web3.utils.utf8ToHex("Female"),
      40,
      "Lorem Ipsum Bio.",
      "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
      { from: accounts[6] }
    );
    profiles = await this.instance.getProfiles();
    profiles.length.should.be.equal(2);
    profiles[1].should.be.equal(accounts[6]);
  });

  it("...should allow to receive a donation", async () => {
    const amount = web3.utils.toWei("1", "ether");
    const receipt = await this.instance.giveDonation(accounts[1], {
      from: accounts[0],
      value: amount
    });
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogGiveDonation",
      "should be the LogGiveDonation event"
    );
    receipt.logs[0].args._receiver.should.equal(
      accounts[1],
      "should equal to receiver account"
    );
    receipt.logs[0].args._sender.should.equal(
      accounts[0],
      "should equal to sender account"
    );
    receipt.logs[0].args._amount
      .toString()
      .should.equal(amount, "should equal to amount sent");
    var balance = await this.instance.balances(accounts[1]);
    balance.toString().should.be.equal(amount);
    try {
      await this.instance.giveDonation(0x0, {
        from: accounts[0],
        value: amount
      });
      assert(true, "address must be valid");
    } catch (err) {}
  });

  it("Allows to withdraw a donation", async () => {
    var oldBalance = await web3.eth.getBalance(accounts[1]);
    var amount = web3.utils.toWei("1", "ether");
    const receipt = await this.instance.withdrawDonation(amount, {
      from: accounts[1]
    });
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogWithdrawDonation",
      "should be the LogWithdrawDonation event"
    );
    receipt.logs[0].args._owner.should.equal(
      accounts[1],
      "should equal to withdrawer account"
    );
    receipt.logs[0].args._amount
      .toString()
      .should.equal(amount, "should equal to amount sent");
    var newBalance = await web3.eth.getBalance(accounts[1]);
    oldBalance = web3.utils.fromWei(oldBalance, "ether") * 1;
    newBalance = web3.utils.fromWei(newBalance, "ether") * 1;
    newBalance.should.be.above(oldBalance);
    try {
      await this.instance.withdrawDonation(0x0, {
        from: accounts[1]
      });
      assert(true, "address must be valid");
    } catch (err) {}
    var revert = false;
    try {
      amount = web3.utils.toWei("3", "ether");
      await this.instance.withdrawDonation(amount, {
        from: accounts[1]
      });
    } catch (err) {
      revert = true;
      assert(err.reason === "Amount should be less than balance");
    }
    expect(revert).to.equal(true, "Should revert on high amount");
  });

  it("...should toogle circuit breaker.", async () => {
    var receipt = await this.instance.toggleContractActive({
      from: accounts[0]
    });
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogToogleContractActive",
      "should be the LogToogleContractActive event"
    );
    receipt.logs[0].args._stopped.should.equal(true, "should equal to true");
    var revert = false;
    try {
      await this.instance.toggleContractActive({
        from: accounts[1]
      });
    } catch (err) {
      revert = true;
      assert(err.reason === "Only owner");
    }
    expect(revert).to.equal(true, "Should revert on no permissions");
    var receipt = await this.instance.toggleContractActive({
      from: accounts[0]
    });
    receipt.logs.length.should.equal(1, "trigger one event");
    receipt.logs[0].event.should.equal(
      "LogToogleContractActive",
      "should be the LogToogleContractActive event"
    );
    receipt.logs[0].args._stopped.should.equal(false, "should equal to false");
  });

  it("...should stop on emergency circuit breaker.", async () => {
    await this.instance.toggleContractActive({
      from: accounts[0]
    });
    var revert = false;
    try {
      await this.instance.createProfile(
        web3.utils.utf8ToHex("Eduardo Espinoza"),
        web3.utils.utf8ToHex("Male"),
        30,
        "Building the Coffee Economy on the Blockchain @ Affogato Network.",
        "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
        { from: accounts[3] }
      );
    } catch (err) {
      revert = true;
      assert(err.reason === "Contract is stopped");
    }
    expect(revert).to.equal(true, "Should revert on stopped contract");
    revert = false;
    try {
      await this.instance.updateProfile(
        web3.utils.utf8ToHex("Eduardo Garner"),
        web3.utils.utf8ToHex("Male"),
        40,
        "Building the Coffee Economy on the Blockchain @ Affogato Network.",
        "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
        { from: accounts[1] }
      );
    } catch (err) {
      revert = true;
      assert(err.reason === "Contract is stopped");
    }
    expect(revert).to.equal(true, "Should revert on stopped contract");
  });
});
