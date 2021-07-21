import React, { useState } from 'react'

import cn from 'classnames'
import {
  CommandBarButton,
} from 'office-ui-fabric-react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { Link } from 'react-router-dom'

import { useAuthContext } from '../../contexts'
import { getFromStorage } from '../../services/dbService'
import HeaderRightSection from './HeaderRightSection'
import './index.scss'

const Header = ({ className, ...restProps }) => {
  const [authState] = useAuthContext()
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))

  const refreshCompanyName = () => setCompanyName(getFromStorage('companyName'))
  return (
    <div className="header-container">
      <div
        className={cn('header', className)}
        {...restProps}
      >
        {authState.isAuthenticated && (
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
                text="Personalizations"
                checked={false}
              />
            </Link>
            <Link
              className="header__link"
              to="/new-configure"
            >
              <CommandBarButton
                className="header__link__btn"
                iconProps={{ iconName: 'BullseyeTargetEdit' }}
                text="Customize"
                checked={false}
              />
            </Link>
          </div>
        )}
        <Text
          variant="xLarge"
          className="companyName"
          nowrap
          block
        >
          {companyName}
        </Text>
        <HeaderRightSection refreshCompanyName={refreshCompanyName} />
      </div>
    </div>
  )
}

export default Header
