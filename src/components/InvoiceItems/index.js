import React, { useCallback, useState, useRef } from 'react'

import { CommandBarButton, IconButton } from 'office-ui-fabric-react'
import { ComboBox, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'

import { getProducts, groupBy } from '../../utils/helper'

import './index.scss'

const columnProps = {
  styles: { root: { width: '100%', display: 'flex', justifyContent: 'space-between' } },
}

const InvoiceItems = ({
  currentInvoiceItem, currentInvoiceItemIndex, removeInvoiceItem, updateInvoiceItem,
}) => {
  const [itemsFilterValue, setItemsFilterValue] = useState('')

  const itemsComboBoxRef = useRef(null)

  const onChangeField = (itemIndex, stateKey, value) => {
    updateInvoiceItem(itemIndex, { [stateKey]: value })
    setItemsFilterValue('')
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

  const openComboboxDropdown = useCallback(() => itemsComboBoxRef.current?.focus(true), [])

  const filterComboBoxOptions = (product) => (generateProductOptions(product) || [])
    .filter((op) => op.text.toLowerCase().includes(itemsFilterValue.toLowerCase()))

  return (
    <div className="invoice-items animation-slide-up">
      {currentInvoiceItem && (
        <div className="invoice-items__item animation-slide-up">
          <Stack
            horizontal
            {...columnProps}
          >
            <ComboBox
              componentRef={itemsComboBoxRef}
              onClick={openComboboxDropdown}
              allowFreeform
              autoComplete={false}
              className="invoice-items__item__field"
              placeholder="Select a type"
              label="Item name"
              options={filterComboBoxOptions(currentInvoiceItem.product)}
              selectedKey={currentInvoiceItem.product}
              onChange={(_, option) => option && onChangeField(currentInvoiceItemIndex, 'product', option.id)}
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
              label="Pcs"
              value={currentInvoiceItem.quantity}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'quantity', value)}
              required
            />
          </Stack>
          <Stack
            horizontal
            {...columnProps}
          >
            <TextField
              className="invoice-items__item__field"
              label="G. Weight"
              type="number"
              min="0"
              value={currentInvoiceItem.gWeight}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'gWeight', value)}
              suffix="gms"
            />
            <TextField
              className="invoice-items__item__field"
              label="Net Weight"
              type="number"
              min="0"
              value={currentInvoiceItem.weight}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'weight', value)}
              suffix="gms"
            />
          </Stack>
          <Stack
            horizontal
            {...columnProps}
          >
            <TextField
              className="invoice-items__item__field"
              label="Rate"
              type="number"
              value={currentInvoiceItem.price}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'price', value)}
              min="0"
              prefix="₹"
              required
            />
            <TextField
              className="invoice-items__item__field"
              label="MKG (%)"
              type="number"
              value={currentInvoiceItem.mkg}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'mkg', value)}
              min="0"
              suffix="%"
            />
          </Stack>
          <Stack
            horizontal
            {...columnProps}
          >
            <TextField
              className="invoice-items__item__field"
              label="Other"
              type="number"
              value={currentInvoiceItem.other}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'other', value)}
              min="0"
              prefix="₹"
            />
            <TextField
              className="invoice-items__item__field"
              label="Total"
              type="number"
              value={currentInvoiceItem.totalPrice}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
          </Stack>
        </div>
      )}

      <TooltipHost content="Changes are saved automatically">
        <IconButton iconProps={{ iconName: 'InfoSolid' }} />
      </TooltipHost>

      <div className="invoice-items__item invoice-items__item--add-btn animation-slide-up">
        <CommandBarButton
          iconProps={{ iconName: 'Save' }}
          text="Add another"
        />
        <CommandBarButton
          iconProps={{ iconName: 'Save' }}
          text="Save & close"
        />
        <CommandBarButton
          iconProps={{ iconName: 'Delete' }}
          text="Delete"
          onClick={() => removeInvoiceItem(currentInvoiceItem.id)}
        />
      </div>
    </div>
  )
}

export default InvoiceItems
