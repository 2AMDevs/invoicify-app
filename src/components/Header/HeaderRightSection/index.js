import React, { useState, useEffect } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { useHistory } from 'react-router-dom'

import { useAuthContext } from '../../../contexts'
import {
  minimizeApp, toggleFullScreen, quitApp, getProducts,
} from '../../../utils/helper'
import ProductsPage from '../../ProductsPage'
import Settings from '../../Settings'

const HeaderRightSection = ({ refreshCompanyName }) => {
  const history = useHistory()
  const [authState, updateAuthState] = useAuthContext()

  const [productsCount, setProductsCount] = useState(getProducts()?.length)

  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const openProductsPanel = useConstCallback(() => setIsProductsOpen(true))

  const dismissProductsPanel = useConstCallback(() => setIsProductsOpen(false))

  const openSettingsPanel = useConstCallback(() => setIsSettingsOpen(true))

  const dismissSettingsPanel = useConstCallback(() => setIsSettingsOpen(false))

  const refreshProductsCount = () => {
    setProductsCount(getProducts().length || 0)
  }

  const lockIt = () => {
    updateAuthState({ isAuthenticated: false })
    if (window.location.hash !== '#/') history.push('/')
  }

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.ctrlKey) {
        const { key, repeat } = e
        if (repeat) return
        if (key.toLowerCase() === 'l') lockIt()
      }
    }
    document.addEventListener('keydown', keyDownHandler, true)
    return () => document.removeEventListener('keydown', keyDownHandler, true)
  })

  return (
    <div className="header__right-section">
      {authState.isAuthenticated && (
        <CommandBarButton
          className="header__link__btn"
          iconProps={{ iconName: 'ProductVariant' }}
          text="Products"
          onClick={openProductsPanel}
        />
      )}
      {authState.isAuthenticated && (
        <CommandBarButton
          className="header__link__btn"
          iconProps={{ iconName: 'Settings' }}
          onClick={openSettingsPanel}
        />
      )}
      {authState.isAuthenticated && (
        <CommandBarButton
          className="header__link__btn"
          iconProps={{ iconName: 'lockSolid' }}
          onClick={lockIt}
        />
      )}
      {localStorage.version && (
        <CommandBarButton
          className="header__link__btn"
          text={`v${localStorage.version}`}
        />
      )}
      <CommandBarButton
        className="header__link__btn"
        iconProps={{ iconName: 'ChromeFullScreen' }}
        onClick={toggleFullScreen}
      />
      <CommandBarButton
        className="header__link__btn__mini"
        iconProps={{ iconName: 'ChromeMinimize' }}
        onClick={minimizeApp}
      />
      <CommandBarButton
        className="header__link__btn__exit"
        iconProps={{ iconName: 'ChromeClose' }}
        onClick={quitApp}
      />
      <Panel
        isLightDismiss
        className="header__right-section__products-panel"
        headerClassName="header__right-section__products-panel__header"
        isOpen={isProductsOpen}
        onDismiss={dismissProductsPanel}
        closeButtonAriaLabel="Close"
        headerText={`Products (${productsCount})`}
      >
        <ProductsPage refreshProductsCount={refreshProductsCount} />
      </Panel>
      <Panel
        isLightDismiss
        className="header__right-section__settings-panel"
        headerClassName="header__right-section__settings-panel__header"
        isOpen={isSettingsOpen}
        onDismiss={dismissSettingsPanel}
        closeButtonAriaLabel="Close"
        headerText="Settings"
      >
        <Settings refreshCompanyName={refreshCompanyName} />
      </Panel>
    </div>
  )
}

export default HeaderRightSection
