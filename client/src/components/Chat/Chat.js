import React, { Component } from 'react'
import ChatInput from '../ChatInput/ChatInput'
import Messages from '../Messages/Messages'

export default class Chat extends Component {

  render() {
    return (
      <div>
        <Messages messages={this.props.messages} />
        <ChatInput sender={this.props.sender} recipient={this.props.recipient} sendMessage={this.props.sendMessage} />
      </div>
    )
  }
}
