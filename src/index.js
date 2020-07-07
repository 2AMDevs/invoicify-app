import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import { initializeIcons } from '@uifabric/icons'
import { loadTheme } from 'office-ui-fabric-react'

import { Header } from './components'
import { HomePage, ProductsPage, Settings } from './pages'
import { initializeSettings } from './helper/helper'

import './index.scss'

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
    neutralLighterAlt: '#23272A',
    neutralLighter: '#72767d',
    neutralLight: '#4f545c',
    neutralQuaternaryAlt: '#0d0d0d',
    neutralQuaternary: '#0c0c0c',
    neutralTertiaryAlt: '#72767d',
    neutralTertiary: '#b9bbbe',
    neutralSecondary: '#fcfcfc',
    neutralPrimaryAlt: '#fdfdfd',
    neutralPrimary: '#fafafa',
    neutralDark: '#fefefe',
    black: '#fefefe',
    white: '#23272A',
  },
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
          exact
          path="/products"
          component={ProductsPage}
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
