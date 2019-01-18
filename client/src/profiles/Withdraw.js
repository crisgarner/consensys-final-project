import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Heading, Field, Button, Input } from "rimble-ui";
import { Redirect } from "react-router";

class Withdraw extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      modal: false,
      transactionHash: "",
      hasBalance: false,
      balance: 0,
      withdrawBalance: ""
    };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onChangeWithdrawBalance = this.onChangeWithdrawBalance.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.hasBalance(drizzle);

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        if (drizzleState.transactionStack[this.state.transactionId]) {
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          const balance = this.state.withdrawBalance - this.state.balance;
          this.setState({
            transactionHash: transactionHash,
            modal: true,
            withdrawBalance: "",
            balance: balance
          });
        }
      }
    });
  }

  async hasBalance(drizzle) {
    var balance = await drizzle.contracts.Profiles.methods
      .balances(this.state.account)
      .call();
    balance = drizzle.web3.utils.fromWei(balance.toString(), "ether");
    var hasBalance = balance > 0 ? true : false;
    this.setState({ hasBalance, balance });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeWithdrawBalance(event) {
    this.setState({ withdrawBalance: event.target.value });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.Profiles.methods.withdrawDonation.cacheSend(
      this.props.drizzle.web3.utils.toWei(
        this.state.withdrawBalance.toString(),
        "ether"
      ),
      {
        from: this.props.drizzleState.account
      }
    );
    this.setState({ transactionId: stackId });
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
            <Button onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <Heading.h2>Profile Balance</Heading.h2>
              <Heading.h4>Current Balance: {this.state.balance} ETH</Heading.h4>
              <Form className="form" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Field label="Amount to Withdraw">
                    <Input
                      name="withdrawBalance"
                      type="number"
                      value={this.state.withdrawBalance}
                      onChange={this.onChangeWithdrawBalance}
                      fullWidth
                    />
                  </Field>
                </FormGroup>
                <Button type="submit">Withdraw Balance</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Withdraw;
