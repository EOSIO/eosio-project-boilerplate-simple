import React  from 'react'


class ChatInput extends React.Component {
  messageRef = React.createRef();
  
  

  createMessage = event => {
    // 1.  stop the form from submitting
    event.preventDefault();
    const message = {
      messageText: this.messageRef.current.value,
      messageId: `message-${Date.now()}`,
      dateSent: Date.now(),
      sender: this.props.sender,
      recipient: this.props.recipient
    };
    this.props.sendMessage(message);
    // refresh the form
    event.currentTarget.reset();
  };

  render() {
    return (
      <form className="chat-input" onSubmit={this.createMessage}>
        <p>Sender : {this.props.sender.account}</p>
        <p>Recipient : {this.props.recipient.publicKey.publicKey}</p>      

        <input type="text"
          name="name"
          ref={this.messageRef}
          placeholder="Write a message..."
          required />
        <button type="submit">+ Send Message</button>
      </form>
    );
  }
}



export default ChatInput;