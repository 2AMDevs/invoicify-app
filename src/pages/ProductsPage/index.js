import React from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'

import { ProductForm } from '../../components'
import { productTableColumns, getProducts, deleteProducts } from '../../utils/helper'

import './index.scss'

class ProductsPage extends React.Component {
  constructor (props) {
    super(props)

    this.actionColumn = {
      key: 'column5',
      name: 'Actions',
      minWidth: 70,
      maxWidth: 70,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      data: 'number',
      isPadded: false,
      onRender: (item) => (
        <>
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            title="Delete"
            id={`item${item.id}`}
            onClick={() => this.deleteProduct(item)}
            checked={false}
          />
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Edit"
            onClick={() => this.onItemClick(item)}
            checked={false}
          />
        </>
      ),
    }
    this.initialState = {
      columns: [
        ...productTableColumns,
        this.actionColumn,
      ],
      items: getProducts(),
      isProductFormOpen: false,
      currentItem: null,
      teachingBubbleVisible: false,
      targetBtn: null,
    }

    this.state = { ...this.initialState }
  }

  onColumnClick = (_, column) => {
    if (column.key === this.actionColumn.key) return

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

  deleteProduct = (item) => {
    this.toggleTeachingBubbleVisible(item.id)
  }

  finalDelete = () => {
    if (this.state.targetBtn) {
      deleteProducts([this.state.targetBtn])
      this.refreshProductItems()
      this.toggleTeachingBubbleVisible()
    }
  }

  copyAndSort= (items, columnKey, isSortedDescending) => {
    const key = columnKey
    return items.slice(0).sort(
      (a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1),
    )
  }

  refreshProductItems = () => this.setState({ items: getProducts() })

  onItemClick = (item) => this.setState({ currentItem: item, isProductFormOpen: true })

  hideProductForm = () => this.setState({ isProductFormOpen: false, currentItem: null })

  showProductForm = () => this.setState({ isProductFormOpen: true })

  toggleTeachingBubbleVisible = (id) => this.setState((prevState) => {
    return {
      teachingBubbleVisible: !prevState.teachingBubbleVisible,
      targetBtn: typeof id === 'string' ? id : null,
    }
  })

  render () {
    return (
      <div className="products-page">
        {this.state.isProductFormOpen && (
          <ProductForm
            isModalOpen={this.state.isProductFormOpen}
            hideModal={this.hideProductForm}
            product={this.state.currentItem}
            fetchItems={this.refreshProductItems}
          />
        )}

        {this.state.teachingBubbleVisible && (
          <TeachingBubble
            target={`#item${this.state.targetBtn}`}
            primaryButtonProps={{ children: 'Yes, delete', onClick: this.finalDelete }}
            secondaryButtonProps={{ children: 'Cancel', onClick: this.toggleTeachingBubbleVisible }}
            onDismiss={this.toggleTeachingBubbleVisible}
            headline="Confirmation"
          >
            Do you really wana delete this product?
          </TeachingBubble>
        )}

        <CommandBarButton
          className="products-page__hero-btn"
          iconProps={{ iconName: 'CircleAddition' }}
          text="Add New Product"
          onClick={this.showProductForm}
          checked={false}
        />

        {this.state.items && this.state.items.length > 0 ? (
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
            enterModalSelectionOnTouch
          />
        ) : (
          <p className="products-page__no-items">
            No products added
          </p>
        )}
      </div>
    )
  }
}

export default ProductsPage
