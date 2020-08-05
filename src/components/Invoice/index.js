import React, { useEffect, useState, useRef } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton, DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { HoverCard, HoverCardType } from 'office-ui-fabric-react/lib/HoverCard'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import {
  PREVIEW, PRINT, DATE, MASKED, ZERO, ISET, PAY_METHOD,
} from '../../utils/constants'
import {
  getFromStorage, getPdf, getInvoiceSettings, printPDF, currency, groupBy, generateUuid4,
} from '../../utils/helper'
import HoverTotal from '../HoverTotal'
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
  }

  const defaultInvoiceFooter = {
    grossTotal: ZERO,
    cgst: ZERO,
    sgst: ZERO,
    igst: ZERO,
    totalAmount: ZERO,
    oldPurchase: ZERO,
    grandTotal: ZERO,
    [PAY_METHOD.CHEQUE]: ZERO,
    [PAY_METHOD.CARD]: ZERO,
    [PAY_METHOD.UPI]: ZERO,
    [PAY_METHOD.CASH]: ZERO,
    interState: false,
  }

  const [invoice, setInvoice] = useState(defaultInvoice)
  const [invoiceFooter, setInvoiceFooter] = useState(defaultInvoiceFooter)
  const [invoiceItems, setInvoiceItems] = useState([])
  const [currentInvoiceItemIndex, setCurrentInvoiceItemIndex] = useState(null)

  const hoverCard = useRef(null)

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const fetchPDF = async (mode = PRINT) => getPdf(
    { meta: invoice, items: invoiceItems, footer: invoiceFooter }, mode,
  )

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

  const updateInvoiceFooter = (change) => {
    let updatedInvoiceFooter = invoiceFooter
    if (change) {
      updatedInvoiceFooter = { ...invoiceFooter, ...change }
    }
    const {
      oldPurchase, grossTotal, cheque, card, upi,
    } = updatedInvoiceFooter
    const calcSettings = getInvoiceSettings(ISET.CALC)
    const cgst = updatedInvoiceFooter.interState
      ? 0 : grossTotal * 0.01 * currency(calcSettings.cgst)
    const sgst = updatedInvoiceFooter.interState
      ? 0 : grossTotal * 0.01 * currency(calcSettings.sgst)
    const igst = updatedInvoiceFooter.interState
      ? grossTotal * 0.01 * currency(calcSettings.igst) : 0
    const totalAmount = Number((grossTotal + cgst + sgst + igst).toFixed(2))
    setInvoiceFooter({
      ...updatedInvoiceFooter,
      grossTotal: Number(grossTotal.toFixed(2)),
      cgst,
      sgst,
      igst,
      totalAmount,
      grandTotal: totalAmount - oldPurchase,
      cash: totalAmount - oldPurchase - card - cheque - upi,
    })
  }

  const updateInvoiceItem = (index, valueObject) => {
    let grossTotal = 0
    setInvoiceItems(invoiceItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, ...valueObject }
        // The logic is price*weight + %MKG + other
        const totalPrice = (currency(newItem.price) * newItem.weight
        * (1 + 0.01 * currency(newItem.mkg)) + currency(newItem.other))
        grossTotal += currency(totalPrice)
        return {
          ...newItem,
          totalPrice,
        }
      }
      grossTotal += currency(item.totalPrice)
      return item
    }))
    updateInvoiceFooter({ grossTotal })
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
            <Toggle
              label="Inter State?"
              checked={invoiceFooter.interState}
              onChange={(_, value) => updateInvoiceFooter({ interState: value })}
            />
            <TextField
              label="Gross Total"
              type="number"
              value={invoiceFooter.grossTotal}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
            <TextField
              label="Total Amount"
              type="number"
              value={invoiceFooter.totalAmount}
              disabled
              readOnly
              min="0"
              prefix="₹"
            />
            <TextField
              label="Old Purchase"
              type="number"
              value={invoiceFooter.oldPurchase}
              onChange={(_, value) => {
                updateInvoiceFooter({ oldPurchase: value })
              }}
              min="0"
              prefix="₹"
            />
            <HoverCard
              className="invoice__hover-card"
              cardDismissDelay={2000}
              type={HoverCardType.plain}
              plainCardProps={{
                onRenderPlainCard: () => HoverTotal(
                  { hoverCard, invoiceFooter, updateInvoiceFooter },
                ),
              }}
              componentRef={hoverCard}
            >
              <TextField
                className="no-box-shadow"
                label="Grand Total"
                type="number"
                value={invoiceFooter.grandTotal}
                disabled
                readOnly
                min="0"
                prefix="₹"
              />
            </HoverCard>
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
