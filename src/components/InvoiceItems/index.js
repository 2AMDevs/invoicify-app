import React, { useState } from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import './index.scss'

const InvoiceItems = ({ invoiceItems, setInvoiceItems }) => {
  const [isVisibleInputRow, toggleInputRow] = useState(false)

  const showInputRow = () => toggleInputRow(true)

  const hideInputRow = () => toggleInputRow(false)

  return (
    <div className="invoice-items animation-slide-up">
      <div className="invoice-items__header">{`${invoiceItems.length} Item(s)`}</div>
      {invoiceItems.map((item) => (
        <div className="invoice-items__item animation-slide-up">
          <p
            className="invoice-items__item__field"
            title={item.name}
          >
            {item.name}
          </p>
          <p className="invoice-items__item__field">{item.type}</p>
          <p className="invoice-items__item__field">{`${item.weight} g`}</p>
          <p className="invoice-items__item__field">{`${item.price} ₹`}</p>
          <p className="invoice-items__item__field">{item.quantity}</p>
          <p className="invoice-items__item__field">{`${item.quantity * item.price} ₹`}</p>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            onClick={hideInputRow}
          />
        </div>
      ))}
      {!isVisibleInputRow && (
        <div className="invoice-items__item invoice-items__item--add-btn animation-slide-up">
          <CommandBarButton
            iconProps={{ iconName: 'CircleAddition' }}
            text="Add New Item"
            onClick={showInputRow}
          />
        </div>
      )}
      {!isVisibleInputRow && (
        <div className="invoice-items__item invoice-items__item__input-form animation-slide-up">
          <div className="invoice-items__item__input-form__row">
            <Dropdown
              placeholder="Select an option"
              label="Required dropdown example"
              options={[
                { key: 'A', text: 'Option a', title: 'I am option a.' },
                { key: 'B', text: 'Option b' },
                { key: 'D', text: 'Option d' },
                { key: 'E', text: 'Option e' },
              ]}
              required
            />
            <TextField
              label="Quantity"
            />
          </div>
          <div className="invoice-items__item__input-form__row">
            <TextField
              label="Weight(total)"
              suffix="gram"
            />
            <TextField
              label="Price Per item"
              suffix="₹"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceItems
