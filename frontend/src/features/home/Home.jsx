import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Header, Button } from "semantic-ui-react";

import "./home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <Header className="homeHeader" textAlign="center" as="h1">
          Project Name
        </Header>
        <p className="subHeader">The most amazing project ever</p>

        <div className="entry-links">
          <Link className="entry-link government" to="/dashboard">
            <Button basic color="teal">
              User 1
            </Button>
          </Link>

          <Link className="entry-link companies" to="/dashboard">
            <Button basic color="green">
              User 2
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
