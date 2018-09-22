import React from "react";
import PropTypes from "prop-types";

const Message = props => (
  <div className="message-container" id={props.message.messageId}>
    <h3 className="tagline">
      <span>{props.message.messageText}</span>
    </h3>
    <p>{props.message.userId}</p>
  </div>
);

Message.propTypes = {
  message: PropTypes.object.isRequired
};

export default Message;
