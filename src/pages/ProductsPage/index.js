import React from 'react'

import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'
import { CommandBarButton } from 'office-ui-fabric-react'

import { productTableColumns, tempItems } from '../../helper/helper'

import './index.scss'

class ProductsPage extends React.Component {
  constructor (props) {
    super(props)

    this.initialState = {
      columns: productTableColumns,
      items: tempItems,
    }

    this.state = { ...this.initialState }
  }

  onColumnClick = (_, column) => {
    const { columns, items } = this.state
    const newColumns = columns.slice()
    const currColumn = newColumns.filter((currCol) => column.key === currCol.key)[0]
    newColumns.forEach((newCol) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending
        currColumn.isSorted = true
      } else {
        newCol.isSorted = false
        newCol.isSortedDescending = true
      }
    })
    const newItems = this.copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending)
    this.setState({
      columns: newColumns,
      items: newItems,
    })
  }

  copyAndSort= (items, columnKey, isSortedDescending) => {
    const key = columnKey
    return items.slice(0).sort(
      (a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1),
    )
  }

  onItemClick = (item) => {
    // open edit modal when clicked
    console.log(item)
  }

  openCreateModal = (e) => {
    console.log(e)
  }

  render () {
    return (
      <div className="products-page">
        <CommandBarButton
          className="products-page__hero-btn"
          iconProps={{ iconName: 'CircleAddition' }}
          text="Add New Product"
          onClick={this.openCreateModal}
          checked={false}
        />

        <DetailsList
          items={this.state.items}
          compact={false}
          columns={this.state.columns}
          onColumnHeaderClick={this.onColumnClick}
          selectionMode={SelectionMode.none}
          getKey={(item, index) => `${item.name} - ${index}`}
          setKey="multiple"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible
          onActiveItemChanged={this.onItemClick}
          enterModalSelectionOnTouch
        />
      </div>
    )
  }
}

export default ProductsPage
