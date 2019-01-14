import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import constants from "../constants";
import {
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";
import { Card, Text, Field, Button } from "rimble-ui";

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
      amount: "",
      currentAccount: drizzleState.accounts[0],
      modal: false,
      transactionHash: "",
      editActive: false
    };
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeAmount(event) {
    this.setState({ amount: event.target.value });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    const { address } = this.props;
    const stackId = await this.props.drizzle.contracts.Profiles.methods.giveDonation.cacheSend(
      address,
      {
        from: this.props.drizzleState.account,
        value: this.props.drizzle.web3.utils.toWei(
          this.state.amount.toString(),
          "ether"
        )
      }
    );
    this.setState({ transactionId: stackId });
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
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        if (drizzleState.transactionStack[this.state.transactionId]) {
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          this.setState({
            transactionHash: transactionHash,
            modal: true,
            amount: 0
          });
        }
      }
    });
  }

  render() {
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggle}>Transaction Confirmed!</ModalHeader>
          <ModalBody>Transaction Hash: {this.state.transactionHash}</ModalBody>
          <ModalFooter>
            <Button onClick={this.toggle}>Close</Button>{" "}
          </ModalFooter>
        </Modal>
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

            <Form className="form" onSubmit={this.onSubmitForm}>
              <FormGroup>
                <Field label="Amount">
                  <InputGroup>
                    <Input
                      type="number"
                      name="amount"
                      value={this.state.amount}
                      onChange={this.onChangeAmount}
                    />
                    <InputGroupAddon addonType="append">ETH</InputGroupAddon>
                  </InputGroup>
                </Field>
              </FormGroup>

              <Button type="submit">Make Donation</Button>
            </Form>
          </Text>
        </Card>
      </>
    );
  }
}

export default withRouter(ProfileCard);
