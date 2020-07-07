import React from 'react'

import { getFromStorage } from '../../helper/helper'

import './index.scss'

const ProductsPage = () => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  return (
    <div className="products-page">
      {nextInvoiceNumber}
    </div>
  )
}

export default ProductsPage
