import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Home, Dashboard } from "./features";

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/Dashboard" component={Dashboard} />
      <Route component={Home} />
    </Switch>
  </Router>
);

export default Routes;
