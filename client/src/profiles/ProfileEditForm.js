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
import {
  Heading,
  Field,
  Input,
  Textarea,
  Select,
  Button,
  PublicAddress
} from "rimble-ui";
import ipfs from "../scripts/ipfs";
import constants from "../constants";
import { withRouter } from "react-router";

class ProfileEditForm extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      name: "",
      sex: "Female",
      age: "",
      bio: "",
      imageHash: "",
      account: drizzleState.accounts[0],
      modal: false,
      transactionHash: "",
      buffer: "",
      fileText: "Select Profile Image",
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: ""
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeSex = this.onChangeSex.bind(this);
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeName(event) {
    this.setState({ name: event.target.value });
  }

  onChangeSex(event) {
    this.setState({ sex: event.target.value });
  }

  onChangeAge(event) {
    this.setState({ age: event.target.value });
  }

  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  onChangeImage(event) {
    this.setState({ imageHash: event.target.value });
  }

  //Take file input from user
  //TODO: restrict only images
  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    var fileText = "Select Profile Image";
    if (event.target.files[0] != null) {
      fileText = event.target.files[0].name;
    }
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, fileText);
  };

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async (reader, fileText) => {
    //file is converted to a buffer for upload to IPFS
    this.setState({ fileText });
    const buffer = await Buffer.from(reader.result);
    //set this buffer-using es6 syntax
    this.setState({ buffer });
  };

  componentDidMount() {
    const { drizzle } = this.props;
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
    const { address } = this.props.match.params;
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
      address: result.owner,
      fileText: result.imageHash
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSubmitForm(event) {
    event.preventDefault();
    if (this.state.imageHash == this.state.fileText) {
      const toBytes32 = this.props.drizzle.web3.utils.utf8ToHex;
      const stackId = await this.props.drizzle.contracts.Profiles.methods.updateProfile.cacheSend(
        toBytes32(this.state.name),
        toBytes32(this.state.sex),
        this.state.age,
        this.state.bio,
        this.state.imageHash,
        { from: this.props.drizzleState.account }
      );
      this.setState({ transactionId: stackId });
    } else {
      await ipfs.add(this.state.buffer, async (err, ipfsHash) => {
        this.setState({ imageHash: ipfsHash[0].hash });
        const toBytes32 = this.props.drizzle.web3.utils.utf8ToHex;
        const stackId = await this.props.drizzle.contracts.Profiles.methods.updateProfile.cacheSend(
          toBytes32(this.state.name),
          toBytes32(this.state.sex),
          this.state.age,
          this.state.bio,
          this.state.imageHash,
          { from: this.props.drizzleState.account }
        );
        this.setState({ transactionId: stackId });
      });
    }
  }

  render() {
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

        <Container className="mt-4 mb-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <Heading.h2>Update Profile</Heading.h2>
              <img
                src={`${constants.IPFS_URL}/${this.state.imageHash}`}
                width="90"
                className="mb-4 rounded"
              />
              <Form className="form" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Field label="Full Name">
                    <Input
                      name="name"
                      value={this.state.name}
                      onChange={this.onChangeName}
                      fullWidth
                    />
                  </Field>
                </FormGroup>
                <FormGroup>
                  <PublicAddress address={this.props.match.params.address} />
                </FormGroup>
                <FormGroup>
                  <Field label="Change Profile Picture">
                    <Input
                      type="file"
                      className="custom-file-input"
                      onChange={this.captureFile}
                      id="customFile"
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {this.state.fileText}
                    </label>
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Field label="Sex" className="sex">
                    <Select
                      items={["Female", "Male"]}
                      name="select"
                      id="sex"
                      value={this.state.sex}
                      onChange={this.onChangeSex}
                    />
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Field label="Age">
                    <Input
                      type="number"
                      name="age"
                      value={this.state.age}
                      onChange={this.onChangeAge}
                    />
                  </Field>
                </FormGroup>
                <FormGroup>
                  <Field label="Bio">
                    <Textarea
                      type="textarea"
                      name="text"
                      rows={4}
                      value={this.state.bio}
                      onChange={this.onChangeBio}
                    />
                  </Field>
                </FormGroup>
                <Button type="submit">Update Profile</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(ProfileEditForm);
