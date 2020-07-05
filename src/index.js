import { initializeIcons } from '@uifabric/icons'
import { loadTheme } from 'office-ui-fabric-react'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Header } from './components'
import './index.scss'
import { HomePage, Settings } from './pages'

loadTheme({
  palette: {
    themePrimary: '#f2f2f2',
    themeLighterAlt: '#f4f4f4',
    themeLighter: '#f5f5f5',
    themeLight: '#f6f6f6',
    themeTertiary: '#f8f8f8',
    themeSecondary: '#f9f9f9',
    themeDarkAlt: '#fbfbfb',
    themeDark: '#fcfcfc',
    themeDarker: '#fdfdfd',
    neutralLighterAlt: '#262626',
    neutralLighter: '#2f2f2f',
    neutralLight: '#3d3d3d',
    neutralQuaternaryAlt: '#464646',
    neutralQuaternary: '#4d4d4d',
    neutralTertiaryAlt: '#6b6b6b',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1c1c1c',
  },
})

initializeIcons()

ReactDOM.render(
  <Router>
    <div>
      <header className="home-page__header">
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
