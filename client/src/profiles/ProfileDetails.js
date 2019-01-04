import React, { Component } from "react";
import { Container, Col, Row, Card, CardBody } from "reactstrap";
import { withRouter } from "react-router";
import constants from "../constants";

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sex: "",
      age: "",
      bio: "",
      imageHash: ""
    };
  }

  async componentDidMount() {
    const { drizzle } = this.props;
    const { address } = this.props.match.params;
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
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <h2>Profile Details</h2>
              <Card>
                <img
                  src={`${constants.IPFS_URL}/${this.state.imageHash}`}
                  width="90"
                  className="mt-4 ml-4 rounded"
                />
                <CardBody>
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
                  <p>
                    <b>Address:</b> {this.state.address}
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(ProfileForm);
