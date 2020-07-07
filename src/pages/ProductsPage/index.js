import React from 'react'

import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'

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
    console.log(column)
  }

  onItemClick = (item) => {
    console.log(item)
  }

  render () {
    return (
      <div className="products-page">
        <DetailsList
          items={this.state.items}
          compact={false}
          columns={productTableColumns}
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
