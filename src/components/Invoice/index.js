import React, { useEffect, useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton, DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'

import {
  PREVIEW, PRINT, DATE, MASKED, ZERO,
} from '../../utils/constants'
import {
  getFromStorage, getPdf, getInvoiceSettings, printPDF, currency, groupBy, generateUuid4,
} from '../../utils/helper'
import InvoiceItems from '../InvoiceItems'
import InvoiceItemsTable from '../InvoiceItemsTable'

import './index.scss'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: 15 }

const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.05 },
  styles: { root: { width: deviceWidth * 0.3, display: 'flex', justifyContent: 'space-between' } },
}

const Invoice = ({ showPdfPreview }) => {
  const [isInvoiceItemFormOpen, setIsInvoiceItemFormOpen] = useState(false)

  const openInvoiceItemsPanel = useConstCallback(() => setIsInvoiceItemFormOpen(true))

  const dismissInvoiceItemsPanel = useConstCallback(() => setIsInvoiceItemFormOpen(false))

  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')

  const invoiceSettings = getInvoiceSettings()

  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber)

  const defaultInvoice = {
    'Invoice Number': invoiceNumber,
    'Invoice Date': new Date(),
    grossTotal: ZERO,
    igst: ZERO,
    cgst: ZERO,
    sgst: ZERO,
    totalAmount: ZERO,
    oldPurchase: ZERO,
    grandTotal: ZERO,
    interState: false,
  }

  const [invoice, setInvoice] = useState(defaultInvoice)

  const [invoiceItems, setInvoiceItems] = useState([])

  const [currentInvoiceItemIndex, setCurrentInvoiceItemIndex] = useState(null)

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const fetchPDF = async (mode = PRINT) => getPdf({ meta: invoice, items: invoiceItems }, mode)

  const resetForm = () => {
    setInvoice(defaultInvoice)
    setInvoiceItems([])
  }

  const printAndMove = async () => {
    const pdfBytes = await fetchPDF()
    printPDF(pdfBytes)
    setInvoiceNumber(invoiceNumber + 1)
    resetForm()
  }

  const previewPDF = async () => {
    const pdfBytes = await fetchPDF(PREVIEW)
    showPdfPreview(pdfBytes)
  }

  const addInvoiceItem = (invoiceItem) => {
    setInvoiceItems([...invoiceItems, invoiceItem])
  }

  const removeInvoiceItem = (id) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id))
    dismissInvoiceItemsPanel()
  }

  const updateInvoiceItem = (index, valueObject) => {
    let grossTotal = 0
    setInvoiceItems(invoiceItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, ...valueObject }
        // The logic is price*weight + %MKG + other
        const totalPrice = (currency(newItem.price) * newItem.weight
        * (1 + 0.01 * currency(newItem.mkg)) + currency(newItem.other))
        grossTotal += totalPrice
        return {
          ...newItem,
          totalPrice,
        }
      }
      grossTotal += currency(item.totalPrice)
      return item
    }))

    const cgst = invoice.interState ? 0 : grossTotal * 0.015
    const sgst = invoice.interState ? 0 : grossTotal * 0.015
    const igst = invoice.interState ? grossTotal * 0.035 : 0
    const totalAmount = Number((grossTotal + cgst + sgst + igst).toFixed(2))
    const { oldPurchase } = invoice
    setInvoice({
      ...invoice,
      grossTotal: Number(grossTotal.toFixed(2)),
      cgst,
      sgst,
      igst,
      totalAmount,
      grandTotal: totalAmount - oldPurchase,
    })
  }

  const addNewInvoiceItem = () => {
    const newItemId = generateUuid4()
    addInvoiceItem({
      id: newItemId,
      product: null,
      quantity: ZERO,
      weight: ZERO,
      price: ZERO,
      mkg: ZERO,
      gWeight: ZERO,
      other: ZERO,
      totalPrice: ZERO,
    })
    setCurrentInvoiceItemIndex(invoiceItems.length)
    openInvoiceItemsPanel()
  }

  const editInvoiceItem = (id) => {
    setCurrentInvoiceItemIndex(invoiceItems.findIndex((item) => item.id === id))
    openInvoiceItemsPanel()
  }

  const groupedSettings = groupBy(invoiceSettings, 'row')

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="animation-slide-up invoice">
      <Stack horizontal>
        <Stack
          vertical
          tokens={stackTokens}
          styles={{ root: { width: deviceWidth * 0.3 } }}
        >
          {Object.keys(groupedSettings).map((row) => (
            <Stack
              horizontal={groupedSettings[row].length > 1}
              key={row}
              {...columnProps}
            >
              {groupedSettings[row].map((field) => {
                const props = {
                  label: field.name,
                  key: field.name,
                  value: invoice[field.name],
                  onChange: (_, val) => {
                    setInvoice({ ...invoice, [field.name]: val })
                  },
                  required: field.required,
                  disabled: field.disabled,
                }
                return (
                // eslint-disable-next-line no-nested-ternary
                  field.type === DATE
                    ? (
                      <DatePicker
                        {...props}
                        value={invoice[field.name] ?? new Date()}
                        ariaLabel="Select a date"
                        allowTextInput
                        onSelectDate={(date) => {
                          setInvoice({ ...invoice, [field.name]: date })
                        }}
                      />
                    ) : field.type === MASKED
                      ? (
                        <MaskedTextField
                          {...props}
                          mask={field.mask}
                          maskChar=" "
                          value={field.startIndex
                            ? invoice[field.name]?.substr(field.startIndex)
                            : invoice[field.name]}
                        />
                      ) : <TextField {...props} />
                )
              })}
            </Stack>
          ))}
          <Stack
            horizontal
            tokens={stackTokens}
            styles={columnProps.styles}
          >
            <DefaultButton
              text="Print"
              iconProps={{ iconName: 'print' }}
              primary
              onClick={printAndMove}
            />
            <DefaultButton
              text="Preview"
              iconProps={{ iconName: 'LightningBolt' }}
              primary
              onClick={previewPDF}
            />
            <DefaultButton
              text="Skip"
              iconProps={{ iconName: 'forward' }}
              onClick={() => setInvoiceNumber(invoiceNumber + 1)}
            />
            <DefaultButton
              text="Reset"
              iconProps={{ iconName: 'refresh' }}
              onClick={resetForm}
            />
          </Stack>
        </Stack>
        <Stack
          styles={{ root: { width: deviceWidth * 0.7, padding: '0 0 0 4rem' } }}
        >
          <CommandBarButton
            className="invoice__add-item-btn"
            iconProps={{ iconName: 'CircleAddition' }}
            text="Add New Item"
            onClick={addNewInvoiceItem}
          />
          <InvoiceItemsTable
            items={invoiceItems}
            removeInvoiceItem={removeInvoiceItem}
            editInvoiceItem={editInvoiceItem}
          />
          <br />
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: deviceWidth * 0.01 }}
          >
            <Checkbox
              label="Same State?"
              boxSide="end"
              checked={!invoice.interState}
              onChange={(_, val) => setInvoice({ ...invoice, interState: !val })}
            />
            <TextField
              className="invoice-items__item__field"
              label="Gross Total"
              type="number"
              value={invoice.grossTotal}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
            <TextField
              className="invoice-items__item__field"
              label="Total Amount"
              type="number"
              value={invoice.totalAmount}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
            <TextField
              className="invoice-items__item__field"
              label="Old Purchase"
              type="number"
              value={invoice.oldPurchase}
              onChange={(_, val) => {
                setInvoice({ ...invoice, oldPurchase: val })
              }}
              min="0"
              prefix="₹"
            />
            <TextField
              className="invoice-items__item__field"
              label="Grand Total"
              type="number"
              value={invoice.grandTotal}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
          </Stack>
        </Stack>
      </Stack>
      <Panel
        isLightDismiss
        className="invoice__item-panel"
        headerClassName="invoice__item-panel__header"
        isOpen={isInvoiceItemFormOpen}
        onDismiss={dismissInvoiceItemsPanel}
        closeButtonAriaLabel="Close"
        headerText="Invoice item"
      >
        <InvoiceItems
          invoiceItems={invoiceItems}
          currentInvoiceItemIndex={currentInvoiceItemIndex}
          currentInvoiceItem={invoiceItems[currentInvoiceItemIndex]}
          setInvoiceItems={setInvoiceItems}
          removeInvoiceItem={removeInvoiceItem}
          updateInvoiceItem={updateInvoiceItem}
          dismissInvoiceItemsPanel={dismissInvoiceItemsPanel}
          addNewInvoiceItem={addNewInvoiceItem}
        />
      </Panel>
    </div>
  )
}

export default Invoice
