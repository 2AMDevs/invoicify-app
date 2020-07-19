import React from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { ComboBox, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { getProducts, generateUuid4, groupBy } from '../../utils/helper'

import './index.scss'

const InvoiceItems = ({
  invoiceItems, addInvoiceItem, removeInvoiceItem, updateInvoiceItem
}) => {
  const addNewInvoiceItem = () => {
    addInvoiceItem({
      id: generateUuid4(), type: null, quantity: 0, weight: 0, price: 0, totalPrice: 0,
    })
  }

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
  return (
    <div className="invoice-items animation-slide-up">
      <div className="invoice-items__header">{`${invoiceItems.length} Item(s)`}</div>
      {invoiceItems.map((item, index) => (
        <div
          className="invoice-items__item animation-slide-up"
          key={item.id}
        >
          <ComboBox
            allowFreeform
            className="invoice-items__item__field"
            placeholder="Select a type"
            label="Item name"
            options={generateProductOptions(item.type)}
            selectedKey={item.type}
            onChange={(_, option) => onChangeField(index, 'type', option.id)}
            required
          />
          <TextField
            className="invoice-items__item__field"
            type="number"
            min="0"
            label="Quantity"
            value={item.quantity}
            onChange={(_, value) => onChangeField(index, 'quantity', value)}
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Weight(total)"
            type="number"
            min="0"
            value={item.weight}
            onChange={(_, value) => onChangeField(index, 'weight', value)}
            suffix="gram"
          />
          <TextField
            className="invoice-items__item__field"
            label="Price Per item"
            type="number"
            value={item.price}
            onChange={(_, value) => onChangeField(index, 'price', value)}
            min="0"
            prefix="₹"
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Total Price"
            type="number"
            value={item.totalPrice}
            disabled
            min="0"
            prefix="₹"
          />
          <IconButton
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
