import React from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { ComboBox, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { getProducts, generateUuid4, groupBy } from '../../utils/helper'

import './index.scss'

const InvoiceItems = ({
  invoiceItems, addInvoiceItem, removeInvoiceItem, updateInvoiceItem,
}) => {
  const addNewInvoiceItem = () => {
    addInvoiceItem({
      id: generateUuid4(),
      product: null,
      quantity: 0,
      weight: 0,
      price: 0,
      mkg: 0,
      other: 0,
      totalPrice: 0,
    })
  }
  const [itemsFilterValue, setItemsFilterValue] = React.useState('')

  const itemsComboBoxRef = React.useRef(null)

  const onChangeField = (itemIndex, stateKey, value) => {
    updateInvoiceItem(itemIndex, { [stateKey]: value })
  }

  const generateProductOptions = (id) => {
    const products = getProducts().map((op) => ({
      ...op,
      text: `${op.name} - ${op.type}`,
      key: op.id,
      isSelected: id === op.id,
      title: `${op.name} - ${op.type}`,
    }))
    const optionsWithCategory = groupBy(products, 'type')
    const options = []
    Object.keys(optionsWithCategory).forEach((category, index) => {
      if (Object.values(optionsWithCategory)[index]) {
        options.push({
          key: `Header${index}`,
          text: category,
          itemType: SelectableOptionMenuItemType.Header,
        })
        options.push(...Object.values(optionsWithCategory)[index])
      }
    })
    return options
  }

  const openComboboxDropdown = React.useCallback(() => itemsComboBoxRef.current?.focus(true), [])

  const filterComboBoxOptions = (product) => (generateProductOptions(product) || [])
    .filter((op) => op.text.toLowerCase().includes(itemsFilterValue.toLocaleLowerCase()))

  return (
    <div className="invoice-items animation-slide-up">
      <div className="invoice-items__header">{`${invoiceItems.length} Item${invoiceItems.length > 1 ? 's' : ''}`}</div>
      {invoiceItems.map((item, index) => (
        <div
          className="invoice-items__item animation-slide-up"
          key={item.id}
        >
          <ComboBox
            componentRef={itemsComboBoxRef}
            onClick={openComboboxDropdown}
            allowFreeform
            autoComplete={false}
            className="invoice-items__item__field"
            placeholder="Select a type"
            label="Item name"
            options={filterComboBoxOptions(item.product)}
            selectedKey={item.product}
            onChange={(_, option) => option && onChangeField(index, 'product', option.id)}
            onKeyUp={(e) => {
              if (!e.key.includes('Arrow')) {
                setItemsFilterValue(e.target.value)
              }
            }}
            required
            style={{ maxWidth: 300 }}
          />
          <TextField
            className="invoice-items__item__field"
            type="number"
            min="0"
            label="Qty"
            value={item.quantity}
            onChange={(_, value) => onChangeField(index, 'quantity', value)}
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Weight (Total)"
            type="number"
            min="0"
            value={item.weight}
            onChange={(_, value) => onChangeField(index, 'weight', value)}
            suffix="gms"
          />
          <TextField
            className="invoice-items__item__field"
            label="Rate"
            type="number"
            value={item.price}
            onChange={(_, value) => onChangeField(index, 'price', value)}
            min="0"
            prefix="₹"
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="MKG (%)"
            type="number"
            value={item.mkg}
            onChange={(_, value) => onChangeField(index, 'mkg', value)}
            min="0"
            suffix="%"
          />
          <TextField
            className="invoice-items__item__field"
            label="Other"
            type="number"
            value={item.other}
            onChange={(_, value) => onChangeField(index, 'other', value)}
            min="0"
            prefix="₹"
          />
          <TextField
            className="invoice-items__item__field"
            label="Total"
            type="number"
            value={item.totalPrice}
            disabled
            readOnly
            min="0"
            prefix="₹"
          />
          <IconButton
            className="invoice-items__item__icon"
            iconProps={{ iconName: 'Delete' }}
            onClick={() => removeInvoiceItem(item.id)}
          />
        </div>
      ))}
      <div className="invoice-items__item invoice-items__item--add-btn animation-slide-up">
        <CommandBarButton
          iconProps={{ iconName: 'CircleAddition' }}
          text="Add New Item"
          onClick={addNewInvoiceItem}
        />
      </div>
    </div>
  )
}

export default InvoiceItems
