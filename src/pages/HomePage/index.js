import React from "react"
import { Link } from "react-router-dom"

import "./index.css";

const HomePage = () => (
  <div className="App">
    <header className="App-header">
      <p>This page is supposed to list products.</p>
      <br />
      <Link className="App-link" to="/">
        Let's Go Back
      </Link>
    </header>
  </div>
);

export default HomePage;