import React from 'react'

import { initializeIcons } from '@uifabric/icons'
import { loadTheme } from 'office-ui-fabric-react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import { Header } from './components'
import { InvoiceStateProvider, AuthStateProvider } from './contexts'
import { HomePage, InvoiceSettings } from './pages'
import { initializeSettings } from './services/settingsService'
import { darkThemePalette } from './utils/constants'

import './index.scss'

loadTheme({
  palette: darkThemePalette,
})
initializeIcons()
initializeSettings()

ReactDOM.render(
  <Router>
    <AuthStateProvider>
      <div>
        <header>
          <Header />
        </header>
        <main>
          <InvoiceStateProvider>
            <Route
              exact
              path="/"
              component={HomePage}
            />
          </InvoiceStateProvider>
          <Route
            path="/configure"
            component={InvoiceSettings}
          />
        </main>
      </div>
    </AuthStateProvider>
  </Router>,
  document.getElementById('root'),
)
