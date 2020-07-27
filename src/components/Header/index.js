import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import cn from 'classnames'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { Link, useLocation } from 'react-router-dom'

import { getFromStorage } from '../../utils/helper'
import ProductsPage from '../ProductsPage'
import HeaderRightSection from './HeaderRightSection'

import './index.scss'

const Header = ({ className, ...restProps }) => {
  const { pathname } = useLocation()
  const onSettingsPage = pathname === '/settings'

  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const openProductsPanel = useConstCallback(() => setIsProductsOpen(true))

  const dismissProductsPanel = useConstCallback(() => setIsProductsOpen(false))

  return (
    <div
      className={cn('header', className)}
      {...restProps}
    >
      <div className="header__left-section">
        {onSettingsPage ? (
          <Link
            className="header__link"
            to="/"
          >
            <CommandBarButton
              className="header__link__btn"
              iconProps={{ iconName: 'Back' }}
              text="Back"
              checked={false}
            />
          </Link>
        ) : (
          <>
            <Link
              className="header__link"
              to="/"
            >
              <CommandBarButton
                className="header__link__btn"
                iconProps={{ iconName: 'Home' }}
                text="Home"
                checked={false}
              />
            </Link>
            <Link
              className="header__link"
              to="/configure"
            >
              <CommandBarButton
                className="header__link__btn"
                iconProps={{ iconName: 'EntitlementPolicy' }}
                text="Invoice Settings"
                checked={false}
              />
            </Link>
          </>
        )}
      </div>
      <Text
        variant="xLarge"
        className="companyName"
        nowrap
        block
      >
        { getFromStorage('companyName') }
      </Text>
      <HeaderRightSection onSettingsPage={onSettingsPage} />
      {/* { !onSettingsPage ? (
        <div>
          <CommandBarButton
            className="home-page__products-btn"
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
        </div>
      ) : '' }
      <Panel
        isLightDismiss
        className="home-page__products-panel"
        headerClassName="home-page__products-panel__header"
        isOpen={isProductsOpen}
        onDismiss={dismissProductsPanel}
        closeButtonAriaLabel="Close"
        headerText="Products"
      >
        <ProductsPage />
      </Panel> */}
    </div>
  )
}

export default Header
