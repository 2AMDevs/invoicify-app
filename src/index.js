import { initializeIcons } from '@uifabric/icons'
import { loadTheme } from 'office-ui-fabric-react'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'
import { Header } from './components'
import './index.scss'
import { HomePage, Settings } from './pages'

loadTheme({
  palette: {
    themePrimary: '#209cfa',
    themeLighterAlt: '#01060a',
    themeLighter: '#051928',
    themeLight: '#0a2f4b',
    themeTertiary: '#135d96',
    themeSecondary: '#1d89dc',
    themeDarkAlt: '#36a5fa',
    themeDark: '#55b3fb',
    themeDarker: '#81c7fc',
    neutralLighterAlt: '#1e1f21',
    neutralLighter: '#0f0e0e',
    neutralLight: '#0e0e0e',
    neutralQuaternaryAlt: '#0d0d0d',
    neutralQuaternary: '#0c0c0c',
    neutralTertiaryAlt: '#0c0c0c',
    neutralTertiary: '#fcfcfc',
    neutralSecondary: '#fcfcfc',
    neutralPrimaryAlt: '#fdfdfd',
    neutralPrimary: '#fafafa',
    neutralDark: '#fefefe',
    black: '#fefefe',
    white: '#1e1f21',
  },
})

initializeIcons()

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
          path="/settings"
          component={Settings}
        />
      </main>
    </div>
  </Router>,
  document.getElementById('root'),
)
