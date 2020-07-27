import React from 'react'

import cn from 'classnames'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { Link } from 'react-router-dom'

import { getFromStorage } from '../../utils/helper'
import HeaderRightSection from './HeaderRightSection'

import './index.scss'

const Header = ({ className, ...restProps }) => (
  <div
    className={cn('header', className)}
    {...restProps}
  >
    <div className="header__left-section">
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
    </div>
    <Text
      variant="xLarge"
      className="companyName"
      nowrap
      block
    >
      { getFromStorage('companyName') }
    </Text>
    <HeaderRightSection />
  </div>
)

export default Header
