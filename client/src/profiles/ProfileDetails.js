import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import { withRouter } from "react-router";
import { Heading } from "rimble-ui";
import ProfileCard from "./ProfileCard";

class ProfileDetails extends Component {
  render() {
    const { drizzle, drizzleState } = this.props;
    const { address } = this.props.match.params;
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <Heading.h2>Profile Details</Heading.h2>
              <ProfileCard
                drizzle={drizzle}
                address={address}
                drizzleState={drizzleState}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(ProfileDetails);
