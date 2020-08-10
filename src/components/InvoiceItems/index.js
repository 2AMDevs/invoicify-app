import React, { useCallback, useState, useRef } from 'react'

import { CommandBarButton, Icon } from 'office-ui-fabric-react'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { ComboBox, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import {
  getProducts, groupBy, currency, getProductTypes,
} from '../../utils/helper'

import './index.scss'

const columnProps = {
  styles: { root: { width: '100%', display: 'flex', justifyContent: 'space-between' } },
}

const InvoiceItems = ({
  currentInvoiceItem, currentInvoiceItemIndex, removeInvoiceItem, updateInvoiceItem,
  dismissInvoiceItemsPanel, addNewInvoiceItem,
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
          <Checkbox
            label="Old Purchase"
            checked={currentInvoiceItem.isOldItem}
            onChange={(_, isChecked) => onChangeField(currentInvoiceItemIndex, 'isOldItem', isChecked)}
          />

          <Stack
            horizontal
            {...columnProps}
          >
            {!currentInvoiceItem.isOldItem && (
              <>
                <ComboBox
                  componentRef={itemsComboBoxRef}
                  onClick={openComboboxDropdown}
                  allowFreeform
                  autoComplete={false}
                  className="invoice-items__item__field"
                  placeholder="Select an item"
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
                  onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'quantity', currency(value))}
                  required
                />
              </>
            )}
            {currentInvoiceItem.isOldItem && (
              <>
                <Dropdown
                  placeholder="Item Type"
                  className="invoice-items__item__field"
                  required
                  label="Type"
                  options={getProductTypes()}
                  value={currentInvoiceItem.type}
                  selectedKey={currentInvoiceItem.type}
                  style={{ maxWidth: 300 }}
                  onChange={(_, selectedType) => onChangeField(currentInvoiceItemIndex, 'type', selectedType.text)}
                />
                <TextField
                  className="invoice-items__item__field"
                  min="0"
                  max="100"
                  label="Purity"
                  suffix="%"
                  value={currentInvoiceItem.purity}
                  onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'purity', value)}
                  required
                />
              </>
            )}
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
              disabled={!currentInvoiceItem.quantity}
              value={currentInvoiceItem.gWeight}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'gWeight', value)}
              suffix="gms"
            />
            <TextField
              className="invoice-items__item__field"
              label="Net Weight"
              type="number"
              min="0"
              disabled={!currentInvoiceItem.quantity}
              value={currentInvoiceItem.weight}
              onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'weight', value)}
              suffix="gms"
            />
          </Stack>

          <Stack
            horizontal={currentInvoiceItem.isOldItem}
            {...columnProps}
          >
            <Stack
              horizontal
              {...columnProps}
            >
              <TextField
                className="invoice-items__item__field"
                label="Rate"
                type="number"
                disabled={!currentInvoiceItem.quantity}
                value={currentInvoiceItem.price}
                onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'price', value)}
                min="0"
                prefix="₹"
                required
              />
              {!currentInvoiceItem.isOldItem && (
                <TextField
                  className="invoice-items__item__field"
                  label="MKG (%)"
                  type="number"
                  disabled={!currentInvoiceItem.quantity}
                  value={currentInvoiceItem.mkg}
                  onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'mkg', value)}
                  min="0"
                  suffix="%"
                />
              )}
            </Stack>
            <Stack
              horizontal
              styles={!currentInvoiceItem.isOldItem && columnProps.styles}
            >
              {!currentInvoiceItem.isOldItem && (
                <TextField
                  className="invoice-items__item__field"
                  label="Other"
                  type="number"
                  disabled={!currentInvoiceItem.quantity}
                  value={currentInvoiceItem.other}
                  onChange={(_, value) => onChangeField(currentInvoiceItemIndex, 'other', value)}
                  min="0"
                  prefix="₹"
                />
              )}
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
          </Stack>
        </div>
      )}

      <div className="invoice-items__item__info">
        <Icon
          className="invoice-items__item__info--icn"
          iconName="Info"
        />
        Changes are saved automatically
      </div>

      <div className="invoice-items__item invoice-items__item--add-btn animation-slide-up">
        <CommandBarButton
          iconProps={{ iconName: 'Save' }}
          text="Add another"
          onClick={addNewInvoiceItem}
        />
        <CommandBarButton
          iconProps={{ iconName: 'CheckedOutByYou12' }}
          text="Exit form"
          onClick={dismissInvoiceItemsPanel}
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
