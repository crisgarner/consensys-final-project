import React, { Component } from "react";
import ProfileForm from "./profiles/ProfileForm";
import ProfileDetails from "./profiles/ProfileDetails";
import Header from "./profiles/Header";
import "./App.css";
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
      <>
        <Header
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
        <Route
          path="/profile/:address"
          render={() => (
            <ProfileDetails
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          path="/new"
          render={() => (
            <ProfileForm
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
      </>
    );
  }
}

export default withRouter(App);
