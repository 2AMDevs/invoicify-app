import React from 'react'

import { initializeIcons } from '@uifabric/icons'
import { loadTheme } from 'office-ui-fabric-react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import { Header } from './components'
import {
  HomePage, InvoiceSettings, Settings,
} from './pages'
import { darkThemePalette } from './utils/constants'
import { initializeSettings } from './utils/helper'

import './index.scss'

loadTheme({
  palette: darkThemePalette,
})
initializeIcons()
initializeSettings()

ReactDOM.render(
  <Router>
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Route
          exact
          path="/"
          component={HomePage}
        />
        <Route
          path="/configure"
          component={InvoiceSettings}
        />
        <Route
          path="/settings"
          component={Settings}
        />
      </main>
    </div>
  </Router>,
  document.getElementById('root'),
)
