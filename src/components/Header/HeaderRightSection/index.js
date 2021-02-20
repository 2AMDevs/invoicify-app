import React, { useEffect, useState, useCallback } from 'react'

import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { useHistory } from 'react-router-dom'

import { useAuthContext } from '../../../contexts'
import { getProducts } from '../../../services/dbService'
import { minimizeApp, quitApp, toggleFullScreen } from '../../../services/nodeService'
import ProductsPage from '../../ProductsPage'
import Settings from '../../Settings'
import UpdatesPanel from '../../UpdatePanel'

const HeaderRightSection = ({ refreshCompanyName }) => {
  const history = useHistory()
  const [authState, updateAuthState] = useAuthContext()

  const [productsCount, setProductsCount] = useState(getProducts()?.length)

  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const openProductsPanel = useCallback(() => setIsProductsOpen(true), [])

  const dismissProductsPanel = useCallback(() => setIsProductsOpen(false), [])

  const openSettingsPanel = useCallback(() => setIsSettingsOpen(true), [])

  const dismissSettingsPanel = useCallback(() => setIsSettingsOpen(false), [])

  const openUpdatePanel = useCallback(() => setIsUpdateOpen(true), [])
  const dismissUpdatePanel = useCallback(() => setIsUpdateOpen(false), [])

  const refreshProductsCount = () => {
    setProductsCount(getProducts().length || 0)
  }

  const reloadStuff = () => history.push('/')

  const lockIt = () => {
    updateAuthState({ isAuthenticated: false })
    if (window.location.hash !== '#/') reloadStuff()
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
          iconProps={{ iconName: 'Subscribe' }}
          text={`v${localStorage.version}`}
          onClick={openUpdatePanel}
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
        className="header__right-section__update-panel"
        isOpen={isUpdateOpen}
        onDismiss={dismissUpdatePanel}
        closeButtonAriaLabel="Close"
        headerText="Updates Info"
      >
        <UpdatesPanel tag={`v${localStorage.version}`} />
      </Panel>
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
        <Settings
          refreshCompanyName={refreshCompanyName}
          reloadPage={() => {
            dismissSettingsPanel()
            reloadStuff()
          }}
        />
      </Panel>
    </div>
  )
}

export default HeaderRightSection
