import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import { initializeIcons } from '@uifabric/icons'

import { HomePage, InvoiceViewer } from './pages'

import './index.scss'

initializeIcons()

ReactDOM.render(
  <Router>
    <div>
      <main>
        <Route
          exact
          path="/"
          component={HomePage}
        />
        <Route
          path="/invoices"
          component={InvoiceViewer}
        />
      </main>
    </div>
  </Router>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
