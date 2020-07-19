import React, { useState } from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import './index.scss'

const InvoiceItems = ({ invoiceItems, addInvoiceItem, removeInvoiceItem }) => {
  const addNewInvoiceItem = () => {
    addInvoiceItem({
      type: null, quantity: 0, weight: 0, price: 0, totalPrice: 0,
    })
  }

  const onChangeType = (_, a) => console.log(a)

  return (
    <div className="invoice-items animation-slide-up">
      <div className="invoice-items__header">{`${invoiceItems.length} Item(s)`}</div>
      {invoiceItems.map((item, index) => (
        <div
          className="invoice-items__item animation-slide-up"
          key={`${item.type}-${item.quantity}`}
        >
          <Dropdown
            className="invoice-items__item__field"
            placeholder="Select a type"
            label="Type"
            options={[
              { key: 'A', text: 'Option a', title: 'I am option a.' },
              { key: 'B', text: 'Option b', isSelected: true },
              { key: 'D', text: 'Option d' },
              { key: 'E', text: 'Option e' },
            ]}
            value={'E'}
            onChange={onChangeType}
            required
          />
          <TextField
            className="invoice-items__item__field"
            type="number"
            min="0"
            label="Quantity"
            value={item.quantity}
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Weight(total)"
            type="number"
            min="0"
            value={item.weight}
            suffix="gram"
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Price Per item"
            type="number"
            value={item.price}
            min="0"
            suffix="₹"
            required
          />
          <TextField
            className="invoice-items__item__field"
            label="Total Price"
            type="number"
            value={item.totalPrice}
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
