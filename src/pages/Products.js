import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../logo.svg";

const Products = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>This page is supposed to list products.</p>
      <br />
      <Link className="App-link" to="/">
        Let's Go Back
      </Link>
    </header>
  </div>
);

export default Products;
