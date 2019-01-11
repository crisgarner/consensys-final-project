import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import constants from "../constants";
import { Card, Text, PublicAddress, Button } from "rimble-ui";

class ProfileCard extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      name: "",
      sex: "",
      age: "",
      bio: "",
      imageHash: "",
      currentAccount: drizzleState.accounts[0],
      editActive: false
    };
  }

  async componentDidMount() {
    const { drizzle } = this.props;
    const { address } = this.props;
    if (address == this.state.currentAccount) {
      this.setState({ editActive: true });
    }
    const hexToUtf8 = drizzle.web3.utils.hexToUtf8;
    const result = await drizzle.contracts.Profiles.methods
      .addressToProfile(address)
      .call();
    this.setState({
      name: hexToUtf8(result.name),
      sex: hexToUtf8(result.sex),
      age: result.age,
      bio: result.bio,
      imageHash: result.imageHash,
      address: result.owner
    });
  }

  render() {
    return (
      <>
        <Card className="profile-card">
          <img
            src={`${constants.IPFS_URL}/${this.state.imageHash}`}
            width="90"
            className="mb-4 rounded"
          />
          {this.state.editActive && (
            <Link to={`/profile/${this.state.address}/edit`}>
              <Button size="small" className="ml-4">
                Edit Profile
              </Button>
            </Link>
          )}
          <Text>
            <p>
              <b>Name:</b> {this.state.name}
            </p>
            <p>
              <b>Sex:</b> {this.state.sex}
            </p>
            <p>
              <b>Age:</b> {this.state.age}
            </p>
            <p>
              <b>Bio:</b> {this.state.bio}
            </p>
            <PublicAddress address={this.state.address} />
          </Text>
        </Card>
      </>
    );
  }
}

export default withRouter(ProfileCard);
