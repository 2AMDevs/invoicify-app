import React from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'

import {
  deleteProducts, getProducts, getProductsJSON, setProducts,
} from '../../services/dbService'
import { saveCSV } from '../../services/nodeService'
import { getInvoiceDate } from '../../services/pdfService'
import { productTableColumns, SELECT_FILE_TYPE } from '../../utils/constants'
import ImportProducts from '../ImportProducts'
import ListEmpty from '../ListEmpty'
import ProductForm from '../ProductForm'
import './index.scss'

class ProductsPage extends React.Component {
  constructor (props) {
    super(props)

    this.actionColumn = {
      key: 'action-column',
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

  refreshProductItems = () => {
    this.setState({ items: getProducts() })
    if (this.props.refreshProductsCount) this.props.refreshProductsCount()
  }

  deleteAllProducts = () => {
    setProducts([], true)
    this.refreshProductItems()
  }

  onItemClick = (item) => this.setState({ currentItem: item, isProductFormOpen: true })

  hideProductForm = () => this.setState({ isProductFormOpen: false, currentItem: null })

  showProductForm = () => this.setState({ isProductFormOpen: true })

  toggleTeachingBubbleVisible = (id) => this.setState((prevState) => ({
    teachingBubbleVisible: !prevState.teachingBubbleVisible,
    targetBtn: typeof id === 'string' ? id : null,
  }))

  exportProduct = () => saveCSV(
    getProductsJSON(),
    SELECT_FILE_TYPE.EXCEL,
    true,
    `Products-${getInvoiceDate()}.csv`,
  )

  render () {
    return (
      <div className="products-page animation-slide-up">
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

        <div className="products-page__header">
          <CommandBarButton
            className="products-page__header__btn"
            iconProps={{ iconName: 'CircleAddition' }}
            text="Add New"
            onClick={this.showProductForm}
            checked={false}
          />
          <ImportProducts refreshProductItems={this.refreshProductItems} />
          <CommandBarButton
            className="products-page__header__btn"
            iconProps={{ iconName: 'Export' }}
            text="Export"
            onClick={this.exportProduct}
            checked={false}
          />
          <CommandBarButton
            className="products-page__header__btn"
            iconProps={{ iconName: 'Delete' }}
            text="Delete All"
            onClick={this.deleteAllProducts}
            checked={false}
          />
        </div>

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
          <ListEmpty
            type="Products"
            source="Database"
          />
        )}
      </div>
    )
  }
}

export default ProductsPage
