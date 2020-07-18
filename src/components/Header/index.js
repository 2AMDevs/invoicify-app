import React from 'react'

import cn from 'classnames'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { Link, useLocation } from 'react-router-dom'

import { getFromStorage } from '../../utils/helper'

import './index.scss'

const Header = ({ className, ...restProps }) => {
  const { pathname } = useLocation()
  const onSettingsPage = pathname === '/settings'

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
            <Link
              className="header__link"
              to="/products"
            >
              <CommandBarButton
                className="header__link__btn"
                iconProps={{ iconName: 'ProductVariant' }}
                text="Products"
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
      { !onSettingsPage ? (
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
      ) : '' }
    </div>
  )
}

export default Header
