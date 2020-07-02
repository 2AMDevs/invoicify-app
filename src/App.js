import React from "react";
import { Link } from "react-router-dom";

const App = () => (
  <div className="App">
    <header className="App-header">
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
