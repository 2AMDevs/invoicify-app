import React from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { getProducts, generateUuid4 } from '../../utils/helper'

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

  const generateProductOptions = (id) => getProducts().map((op) => ({
    ...op,
    text: op.name,
    key: op.id,
    isSelected: id === op.id,
    title: `${op.name} - ${op.type}`,
  }))

  return (
    <div className="invoice-items animation-slide-up">
      <div className="invoice-items__header">{`${invoiceItems.length} Item(s)`}</div>
      {invoiceItems.map((item, index) => (
        <div
          className="invoice-items__item animation-slide-up"
          key={item.id}
        >
          <Dropdown
            className="invoice-items__item__field"
            placeholder="Select a type"
            label="Type"
            options={generateProductOptions(item.type)}
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
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Price Per item"
            type="number"
            value={item.price}
            onChange={(_, value) => onChangeField(index, 'price', value)}
            min="0"
            suffix="₹"
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Total Price"
            type="number"
            value={item.totalPrice}
            disabled
            min="0"
            suffix="₹"
            required
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => removeInvoiceItem(index)}
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
