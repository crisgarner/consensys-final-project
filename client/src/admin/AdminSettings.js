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
import { Heading, Field, Input, Textarea, Select, Button } from "rimble-ui";
import ipfs from "../scripts/ipfs";

class AdminSettings extends Component {
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
      fileText: "Select Profile Image"
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
    // subscribe to changes in the store
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
            name: "",
            sex: "Female",
            age: "",
            bio: "",
            imageHash: "",
            fileText: "Select Profile Image"
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSubmitForm(event) {
    event.preventDefault();
    await ipfs.add(this.state.buffer, async (err, ipfsHash) => {
      this.setState({ imageHash: ipfsHash[0].hash });
      const toBytes32 = this.props.drizzle.web3.utils.utf8ToHex;
      const stackId = await this.props.drizzle.contracts.Profiles.methods.createProfile.cacheSend(
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
        <Container className="mt-4">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <Heading.h2>Create Profile</Heading.h2>
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
                  <Field label="Profile Picture">
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
                <Button type="submit">Create Profile</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default AdminSettings;
