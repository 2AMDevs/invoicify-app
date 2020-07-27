import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Link } from 'react-router-dom'

import ProductsPage from '../../ProductsPage'

const HeaderRightSection = ({ onSettingsPage }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const openProductsPanel = useConstCallback(() => setIsProductsOpen(true))

  const dismissProductsPanel = useConstCallback(() => setIsProductsOpen(false))

  return (
    <div className="header__right-section">
      { !onSettingsPage ? (
        <>
          <CommandBarButton
            className="header__right-section__products-btn"
            iconProps={{ iconName: 'ProductVariant' }}
            text="Products"
            checked={false}
            onClick={openProductsPanel}
          />
          <Link
            className="header__link"
            to="/settings"
          >
            <CommandBarButton
              className="header__link__btn"
              iconProps={{ iconName: 'Settings' }}
              checked={false}
            />
          </Link>
        </>
      ) : '' }
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
    </div>
  )
}

export default HeaderRightSection
