import cn from 'classnames'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getFromStorage } from '../../helper/helper'
import './index.scss'

const Header = ({ className, ...restProps }) => {
  const { pathname } = useLocation()
  const firstIconName = pathname === '/' ? 'Home' : 'Back'

  return (
    <div
      className={cn('header', className)}
      {...restProps}
    >
      <Link
        className="header__link"
        to="/"
      >
        <CommandBarButton
          className="header__link__btn"
          iconProps={{ iconName: firstIconName.toLowerCase() }}
          text={firstIconName}
          disabled={false}
          checked={false}
        />
      </Link>
      { pathname === '/' ? (
        <Link
          className="header__link"
          to="/settings"
        >
          <CommandBarButton
            className="header__link__btn"
            iconProps={{ iconName: 'Settings' }}
            text="Settings"
            disabled={false}
            checked={false}
          />
        </Link>
      ) : '' }
      <Text
        variant="xLarge"
        className="companyName"
        nowrap
        block
      >
        { getFromStorage('companyName') }
      </Text>
    </div>
  )
}

export default Header
