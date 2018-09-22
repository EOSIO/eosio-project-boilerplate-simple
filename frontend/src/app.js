import React from "react";
import PropTypes from "prop-types";
import Routes from "./routes";
import { Provider } from "react-redux";

import "semantic-ui-css/semantic.min.css";
import "./app.css";

class App extends React.Component {
  render() {
    return (
      <Provider className="app" store={this.props.store}>
        <Routes />
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
