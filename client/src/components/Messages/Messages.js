import React from "react";
import PropTypes from "prop-types";
import Message from '../Message/Message';

class Messages extends React.Component {
  static propTypes = {
    messages: PropTypes.object,
    userId: PropTypes.string
  };

  render() {
    return (
      <div className="message-list">
        <h2>Messages</h2>
        {Object.keys(this.props.messages).map(key => (
          <Message
            message={this.props.messages[key]}
            key={key}
          />
        ))}
      </div>
    );
  }
}

export default Messages;
