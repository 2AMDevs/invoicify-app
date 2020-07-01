import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>This is landing for invoicify.</p>
      <code>
        Hey! @only4{" "}
        <span role="img" aria-label="Hey">
          👋🏻
        </span>
      </code>
      <br />
      <Link className="App-link" to="/products">
        Products Page
      </Link>
    </header>
  </div>
);

export default App;
