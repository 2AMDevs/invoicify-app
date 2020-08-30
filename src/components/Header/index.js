import React, { useState } from 'react'

import cn from 'classnames'
import {
  CommandBarButton, MessageBarButton, MessageBarType, MessageBar,
} from 'office-ui-fabric-react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { Link } from 'react-router-dom'

import { useAuthContext } from '../../contexts'
import { getFromStorage, closeNotification, restartApp } from '../../utils/helper'
import HeaderRightSection from './HeaderRightSection'

import './index.scss'

const Header = ({ className, ...restProps }) => {
  const [authState] = useAuthContext()
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))

  const refreshCompanyName = () => setCompanyName(getFromStorage('companyName'))
  return (
    <div className="header-container">
      <MessageBar
        actions={(
          <div>
            <MessageBarButton
              id="restart-button"
              onClick={restartApp}
              className="hidden"
              type="submit"
            >
              Update & Restart
            </MessageBarButton>
            <MessageBarButton
              id="close-button"
              onClick={closeNotification}
              type="submit"
            >
              Close
            </MessageBarButton>
          </div>
        )}
        messageBarType={MessageBarType.warning}
        isMultiline={false}
        id="notification"
        className="hidden header-container__update-notification"
      >
        <p id="message" />
      </MessageBar>
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
