import React from 'react'

import { Header, SideBar } from '../../components'

import './index.scss'

const HomePage = () => (
  <div className="home-page">
    <header className="home-page__header">
      <Header />
    </header>
    <mail className="home-page__content">
      <SideBar className="home-page__content__sidebar" />
    </mail>
  </div>
)

export default HomePage
