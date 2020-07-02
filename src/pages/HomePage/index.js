import React from 'react'
import { Link } from 'react-router-dom'

import { DefaultButton, ActionButton } from 'office-ui-fabric-react'

import './index.scss'

const menuProps = {
  items: [
    {
      key: 'emailMessage',
      text: 'Email message',
      iconProps: { iconName: 'Mail' },
    },
    {
      key: 'calendarEvent',
      text: 'Calendar event',
      iconProps: { iconName: 'Calendar' },
    },
  ],
}

const HomePage = () => (
  <div className="home-page">
    <header className="home-page__header">
      <p>This page is supposed to list products.</p>
      <br />
      <Link
        className="home-page__header__link"
        to="/invoices"
      >
        <ActionButton
          iconProps={{ iconName: 'AddFriend' }}
          allowDisabledFocus
        >
          Let&apos;s Go to invoices
        </ActionButton>
      </Link>
    </header>
    <mail className="home-page__content">
      <DefaultButton
        text="Primary"
        primary
        split
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        menuProps={menuProps}
        onClick={() => {
          alert('clicked')
        }}
        disabled={false}
        checked={false}
      />
    </mail>
  </div>
)

export default HomePage
