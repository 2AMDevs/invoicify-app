import React from 'react'
import { Link } from 'react-router-dom'

import './index.scss'

const InvoiceViewer = () => (
  <div className="invoice-page">
    <header className="invoice-page__header">
      <p>This page is supposed to be invoice viewer.</p>
      <br />
      <Link
        className="invoice-page__header__link"
        to="/"
      >
        Let&apos;s Go Back
      </Link>
    </header>
  </div>
)

export default InvoiceViewer
