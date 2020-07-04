import React from 'react'
import { Link } from 'react-router-dom'

import cn from 'classnames'
import { CommandBarButton } from 'office-ui-fabric-react'

import './index.scss'

const Header = ({ className, ...restProps }) => (
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
        iconProps={{ iconName: 'home' }}
        text="Home"
        disabled={false}
        checked={false}
      />
    </Link>
    <Link
      className="header__link"
      to="/invoices"
    >
      <CommandBarButton
        className="header__link__btn"
        iconProps={{ iconName: 'M365InvoicingLogo' }}
        text="Invoices"
        disabled={false}
        checked={false}
      />
    </Link>
  </div>
)

export default Header
