import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      name: "",
      sex: "Female",
      age: "",
      email: "",
      bio: "",
      account: drizzleState.accounts[0]
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeSex = this.onChangeSex.bind(this);
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
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

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  onSubmitForm(event) {
    event.preventDefault();
  }

  render() {
    return (
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
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="email@email.com"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
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
    );
  }
}

export default ProfileForm;
