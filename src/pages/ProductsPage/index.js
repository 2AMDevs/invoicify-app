import React from 'react'

import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'

import { getFromStorage } from '../../helper/helper'

import './index.scss'

const ProductsPage = () => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  const onColumnClick = (e, column) => {
    console.log(e.target, column)
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

  const columns = [
    {
      key: 'column1',
      name: 'id',
      className: 'col-1',
      iconClassName: 'col-1-icn',
      ariaLabel: 'Id of the item',
      iconName: 'List',
      isIconOnly: true,
      fieldName: 'id',
      minWidth: 16,
      maxWidth: 16,
      onColumnClick,
      onRender: (item) => <span>{item.id}</span>,
    },
    {
      key: 'column2',
      name: 'Name',
      fieldName: 'name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      onColumnClick,
      data: 'string',
      isPadded: true,
    },
    {
      key: 'column3',
      name: 'Type',
      fieldName: 'type',
      minWidth: 50,
      maxWidth: 90,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      onColumnClick,
      data: 'string',
      isPadded: true,
    },
    {
      key: 'column4',
      name: 'Price',
      fieldName: 'price',
      minWidth: 50,
      maxWidth: 90,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      onColumnClick,
      data: 'number',
      isPadded: true,
    },
  ]

  return (
    <div className="products-page">
      {nextInvoiceNumber}
      <DetailsList
        items={items}
        compact={false}
        columns={columns}
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
