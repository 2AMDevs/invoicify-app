import React from 'react'

import { initializeIcons } from '@uifabric/icons'
import {
  loadTheme, MessageBarButton, MessageBarType, MessageBar,
} from 'office-ui-fabric-react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import { Header } from './components'
import { HomePage, InvoiceSettings } from './pages'
import { darkThemePalette } from './utils/constants'
import { initializeSettings, closeNotification, restartApp } from './utils/helper'

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
        <MessageBar
          actions={(
            <div>
              <MessageBarButton
                id="restart-button"
                onClick={restartApp}
                className="hidden"
                type="submit"
              >
                Update & Restart
              </MessageBarButton>
              <MessageBarButton
                id="close-button"
                onClick={closeNotification}
                type="submit"
              >
                Close
              </MessageBarButton>
            </div>
          )}
          messageBarType={MessageBarType.success}
          isMultiline={false}
          id="notification"
          className="hidden"
        >
          <p id="message" />
        </MessageBar>
        <Route
          exact
          path="/"
          component={HomePage}
        />
        <Route
          path="/configure"
          component={InvoiceSettings}
        />
      </main>
    </div>
  </Router>,
  document.getElementById('root'),
)
