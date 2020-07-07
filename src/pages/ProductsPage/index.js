import React from 'react'

import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'

import { getFromStorage, productTableColumns } from '../../helper/helper'

import './index.scss'

const ProductsPage = () => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  const onColumnClick = (_, column) => {
    console.log(column)
  }

  const onItemClick = (item) => {
    console.log(item)
  }

  const items = [
    {
      id: 0,
      name: 'ring ring ring',
      type: 'gold',
      price: 400,
    },
    {
      id: 2,
      name: 'aring ring ring',
      type: 'silver',
      price: 200,
    },
  ]

  return (
    <div className="products-page">
      {nextInvoiceNumber}
      <DetailsList
        items={items}
        compact={false}
        columns={productTableColumns}
        onColumnHeaderClick={onColumnClick}
        selectionMode={SelectionMode.none}
        getKey={(item, index) => `${item.name} - ${index}`}
        setKey="multiple"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        onActiveItemChanged={onItemClick}
        enterModalSelectionOnTouch
      />
    </div>
  )
}

export default ProductsPage
