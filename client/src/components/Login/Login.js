import React, { Component } from 'react'

export default class Login extends Component {


  render() {
    return (
      <div>
          <h1>Login</h1>
          <p>{this.props.sender.privateKey}</p>
          <p>{this.props.sender.account}</p>
          <button onClick={this.props.setLogin}>Login</button>
      </div>
    )
  }
}
