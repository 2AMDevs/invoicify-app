import React from 'react'

import { IconButton } from 'office-ui-fabric-react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'

import { invoiceItemsTableColumns } from '../../utils/constants'
import { getProducts } from '../../utils/helper'

import './index.scss'

class InvoiceItemsTable extends React.Component {
  constructor (props) {
    super(props)

    this.actionColumn = {
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
            onClick={() => this.deleteInvoiceItem(item)}
            checked={false}
          />
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Edit"
            onClick={() => this.editInvoiceItem(item)}
            checked={false}
          />
        </>
      ),
    }
    this.itemColumn = {
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
    this.initialState = {
      columns: [
        this.itemColumn,
        ...invoiceItemsTableColumns,
        this.actionColumn,
      ],
      isProductFormOpen: false,
      currentItem: null,
      teachingBubbleVisible: false,
      targetBtn: null,
    }

    this.state = { ...this.initialState }
  }

  deleteInvoiceItem = (item) => {
    console.log('delete item', item)
  }

  editInvoiceItem = (item) => {
    console.log('edit item', item)
  }

  render () {
    return (
      <div className="invoice-item-table animation-slide-up">
        {this.props.items && this.props.items.length > 0 ? (
          <DetailsList
            items={this.props.items}
            compact={false}
            columns={this.state.columns}
            selectionMode={SelectionMode.none}
            getKey={(item, index) => `${item.name} - ${index}`}
            setKey="multiple"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible
            enterModalSelectionOnTouch
          />
        ) : (
          <p className="invoice-item-table__no-items">
            No products added
          </p>
        )}
      </div>
    )
  }
}

export default InvoiceItemsTable
