import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import Products from "./pages/Products";

ReactDOM.render(
  <Router>
    <div>
      <main>
        <Route exact path="/" component={App} />
        <Route path="/products" component={Products} />
      </main>
    </div>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
