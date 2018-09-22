import React from "react";
import { render } from "react-dom";
import Router from "./components/Router";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/style.css";

render(<Router />, document.querySelector("#root"));