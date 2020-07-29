import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'

import ProductsPage from '../../ProductsPage'
import Settings from '../../Settings'

const HeaderRightSection = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const openProductsPanel = useConstCallback(() => setIsProductsOpen(true))

  const dismissProductsPanel = useConstCallback(() => setIsProductsOpen(false))

  const openSettingsPanel = useConstCallback(() => setIsSettingsOpen(true))

  const dismissSettingsPanel = useConstCallback(() => setIsSettingsOpen(false))

  return (
    <div className="header__right-section">
      <CommandBarButton
        className="header__link__btn"
        iconProps={{ iconName: 'ProductVariant' }}
        text="Products"
        checked={false}
        onClick={openProductsPanel}
      />
      <CommandBarButton
        className="header__link__btn"
        iconProps={{ iconName: 'Settings' }}
        checked={false}
        onClick={openSettingsPanel}
      />
      <CommandBarButton
        className="header__link__btn"
        text={`v${localStorage.getItem('version')}`}
      />
      <Panel
        isLightDismiss
        className="header__right-section__products-panel"
        headerClassName="header__right-section__products-panel__header"
        isOpen={isProductsOpen}
        onDismiss={dismissProductsPanel}
        closeButtonAriaLabel="Close"
        headerText="Products"
      >
        <ProductsPage />
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
        <Settings />
      </Panel>
    </div>
  )
}

export default HeaderRightSection
