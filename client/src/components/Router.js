import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "../components/App/App";
import NotFound from "./NotFound";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer'

const Router = () => (
  <BrowserRouter>
    <div className="container-fluid">
        <Header />
        <Switch>
            <Route path="/" component={App} />
            <Route component={NotFound} />
        </Switch>
        <Footer />
    </div>
  </BrowserRouter>
);

export default Router;
