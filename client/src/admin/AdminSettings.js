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
import { Heading, Field, Button, Radio } from "rimble-ui";
import { Redirect } from "react-router";

class AdminSettings extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      modal: false,
      selectedOption: "active",
      transactionHash: "",
      isOwner: true,
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: ""
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.destroyContract = this.destroyContract.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.checkOwner(drizzle);
    this.loadData(drizzle);

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        if (drizzleState.transactionStack[this.state.transactionId]) {
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          if (
            drizzleState.transactions[transactionHash].status == "pending" &&
            this.state.modalPending
          ) {
            const balance = this.state.withdrawBalance - this.state.balance;
            this.setState({
              transactionHash: transactionHash,
              modal: true,
              modalTitle: "Transaction Submited!",
              modalBody: "Wait for confirmation",
              modalPending: false
            });
          }
          if (
            drizzleState.transactions[transactionHash].status == "success" &&
            this.state.modalSuccess
          ) {
            this.setState({
              transactionHash: transactionHash,
              modal: true,
              modalTitle: "Success!",
              modalBody: `The information was saved in the blockchain with the confirmation hash: ${
                this.state.transactionHash
              }`,
              modalSuccess: false
            });
          }
        }
      }
    });
  }

  async loadData(drizzle) {
    const result = await drizzle.contracts.Profiles.methods.stopped().call();
    var status = result ? "stopped" : "active";
    this.setState({
      selectedOption: status
    });
  }

  async checkOwner(drizzle) {
    const owner = await drizzle.contracts.Profiles.methods.owner().call();
    var isOwner = owner == this.state.account ? true : false;
    this.setState({ isOwner });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleOptionChange(event) {
    console.log(event.target.value);
    this.setState({
      selectedOption: event.target.value
    });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.Profiles.methods.toggleContractActive.cacheSend(
      { from: this.props.drizzleState.account }
    );
    this.setState({ transactionId: stackId });
  }

  async destroyContract(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.Profiles.methods.destroy.cacheSend(
      { from: this.props.drizzleState.account }
    );
    this.setState({ transactionId: stackId });
  }

  render() {
    if (!this.state.isOwner) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          size="lg"
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.state.modalTitle}
          </ModalHeader>
          <ModalBody>{this.state.modalBody}</ModalBody>
          <ModalFooter>
            <Button onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <Heading.h2>Admin Settings</Heading.h2>
              <Form className="form" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Field label="Contract Status">
                    <Radio
                      label="Active"
                      name="status"
                      value="active"
                      checked={this.state.selectedOption === "active"}
                      onChange={this.handleOptionChange}
                    />
                    <Radio
                      label="Stopped"
                      name="status"
                      value="stopped"
                      checked={this.state.selectedOption === "stopped"}
                      onChange={this.handleOptionChange}
                    />
                  </Field>
                </FormGroup>
                <Button type="submit">Change Settings</Button>
                <Button onClick={this.destroyContract} className="ml-2 red">
                  Destroy Contract
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default AdminSettings;
