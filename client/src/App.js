import React, { Component } from "react";
import ProfileForm from "./profiles/ProfileForm";
import ProfileEditForm from "./profiles/ProfileEditForm";
import ProfileDetails from "./profiles/ProfileDetails";
import ProfileList from "./profiles/ProfileList";
import Header from "./profiles/Header";
import "./App.css";
import { ThemeProvider } from "rimble-ui";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    console.log(this.props);
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Application...";
    return (
      <ThemeProvider>
        <Header
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
        <Route
          exact
          path="/"
          render={() => (
            <ProfileList
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          exact
          path="/profile/:address/edit"
          render={() => (
            <ProfileEditForm
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          exact
          path="/profile/:address"
          render={() => (
            <ProfileDetails
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          exact
          path="/new"
          render={() => (
            <ProfileForm
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
      </ThemeProvider>
    );
  }
}

export default withRouter(App);
