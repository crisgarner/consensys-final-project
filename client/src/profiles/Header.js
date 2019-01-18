import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import Blockies from "react-blockies";
import { Link, Icon } from "rimble-ui";

class Header extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      hasBalance: false,
      balance: 0
    };
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.checkOwner(drizzle);
    this.hasBalance(drizzle);
  }

  async checkOwner(drizzle) {
    const owner = await drizzle.contracts.Profiles.methods.owner().call();
    var isOwner = owner == this.state.account ? true : false;
    this.setState({ isOwner });
  }

  async hasBalance(drizzle) {
    var balance = await drizzle.contracts.Profiles.methods
      .balances(this.state.account)
      .call();
    balance = drizzle.web3.utils.fromWei(balance.toString(), "ether");
    var hasBalance = balance > 0 ? true : false;
    this.setState({ hasBalance, balance });
  }

  render() {
    return (
      <Nav className="mt-4 justify-content-end">
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/">
            <Icon name="Home" size="20" className="mr-1" />
            Profiles
          </Link>
        </NavItem>
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/new">
            <Icon name="PersonAdd" size="20" className="mr-1" />
            New Profile
          </Link>
        </NavItem>

        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/withdraw">
            <Icon name="AccountBalanceWallet" size="20" className="mr-1" />
            Account Balance
          </Link>
        </NavItem>

        {this.state.isOwner && (
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/admin">
              <Icon name="Settings" size="20" className="mr-1" />
              Admin Settings
            </Link>
          </NavItem>
        )}
        <NavItem className="ml-2 mt-1 text-right ">
          <b>Current Account:</b> <br />
          <label>{this.state.account}</label>
        </NavItem>

        <NavItem className="ml-2 mr-4">
          <Blockies seed={this.state.account} size={10} scale={5} />
        </NavItem>
      </Nav>
    );
  }
}

export default Header;
