import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import { withRouter } from "react-router";
import { Heading } from "rimble-ui";
import ProfileCard from "./ProfileCard";

class ProfileList extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      profiles: [],
      currentAccount: drizzleState.accounts[0]
    };
  }

  async componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const profiles = await drizzle.contracts.Profiles.methods
      .getProfiles()
      .call();
    this.setState({ profiles });
  }
  render() {
    const { drizzle, drizzleState } = this.props;
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="12 mt-4">
              <Heading.h2>Profiles List</Heading.h2>
              <Row className="justify-content-center mt-4">
                {this.state.profiles.map(function(address, index) {
                  return (
                    <Col lg="4 mt-4" key={index}>
                      <ProfileCard
                        drizzle={drizzle}
                        address={address}
                        drizzleState={drizzleState}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(ProfileList);
