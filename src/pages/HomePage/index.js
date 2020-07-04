import React from 'react'

import { DefaultButton, ActionButton } from 'office-ui-fabric-react'

import { Header, SideBar } from '../../components'

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
      <Header />
    </header>
    <mail className="home-page__content">
      <SideBar className="home-page__content__sidebar" />
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
