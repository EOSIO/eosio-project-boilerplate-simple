import React, { Component } from 'react'

export default class RequestChat extends Component {
    

  render() {
    return (
      <div>
        Request Chat
        <p>Start Chat with:</p>
        <p>{this.props.proposedRecipient.publicKey}</p>
        <button onClick={() => this.props.setChatRequest(this.props.proposedRecipient)}>>Send</button>
      </div>
    )
  }
}
