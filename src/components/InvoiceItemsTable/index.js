import React from 'react'

import { IconButton } from 'office-ui-fabric-react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'

import { invoiceItemsTableColumns, oldInvoiceItemsTableColumns } from '../../utils/constants'
import { getProducts } from '../../utils/helper'
import ListEmpty from '../ListEmpty'

import './index.scss'

const InvoiceItemsTable = ({ items, oldItemsTable, removeInvoiceItem, editInvoiceItem }) => {
  const actionColumn = {
    key: 'action-column',
    name: 'Actions',
    minWidth: 65,
    maxWidth: 65,
    isPadded: false,
    onRender: (item) => (
      <>
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          title="Delete"
          id={`item${item.id}`}
          onClick={() => removeInvoiceItem(item.id)}
          checked={false}
        />
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          title="Edit"
          onClick={() => editInvoiceItem(item.id)}
          checked={false}
        />
      </>
    ),
  }

  const itemColumn = {
    key: 'column1',
    name: 'Item',
    maxWidth: 150,
    minWidth: 150,
    isResizable: true,
    data: 'string',
    isPadded: true,
    onRender: (item) => (
      <>
        {item && item.product && `${getProducts(item.product).name} - ${getProducts(item.product).type}`}
      </>
    ),
  }

  const oldItemNameColumn = {
    key: 'column1',
    name: 'Type',
    fieldName: 'type',
    isResizable: true,
    maxWidth: 120,
    minWidth: 120,
    data: 'string',
    isPadded: true,
  }

  const columns = [
    oldItemsTable ? oldItemNameColumn : itemColumn,
    ...(oldItemsTable ? oldInvoiceItemsTableColumns : invoiceItemsTableColumns),
    actionColumn,
  ]

  return (
    <div className="invoice-item-table animation-slide-up">
      {items && items.length > 0 ? (
        <DetailsList
          items={items}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={(item, index) => `${item.name} - ${index}`}
          setKey="multiple"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible
          enterModalSelectionOnTouch
        />
      ) : (
        <ListEmpty
          type="Items"
          source="Invoice"
        />
      )}
    </div>
  )
}

export default InvoiceItemsTable
