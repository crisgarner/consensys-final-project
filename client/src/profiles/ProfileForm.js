import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import ipfs from "../scripts/ipfs";

class ProfileForm extends Component {
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
          console.log("inside job");
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          this.setState({
            transactionHash: transactionHash,
            modal: true,
            name: "",
            sex: "Female",
            age: "",
            bio: "",
            imageHash: ""
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
            <Button color="danger" onClick={this.toggle}>
              Close
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Container className="mt-4 ">
          <Row className="justify-content-center mt-4">
            <Col lg="6 mt-4">
              <h2>Create Profile</h2>
              <Form className="form" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeName}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="file"
                    className="custom-file-input"
                    onChange={this.captureFile}
                    id="customFile"
                  />

                  <label className="custom-file-label" htmlFor="customFile">
                    {this.state.fileText}
                  </label>
                </FormGroup>
                <FormGroup>
                  <Label for="sex">Select</Label>
                  <Input
                    type="select"
                    name="select"
                    id="sex"
                    value={this.state.sex}
                    onChange={this.onChangeSex}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    name="age"
                    value={this.state.age}
                    onChange={this.onChangeAge}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleText">Bio</Label>
                  <Input
                    type="textarea"
                    name="text"
                    id="exampleText"
                    value={this.state.bio}
                    onChange={this.onChangeBio}
                  />
                </FormGroup>
                <Button color="primary">Create Profile</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ProfileForm;
