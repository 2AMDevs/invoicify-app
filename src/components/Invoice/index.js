import React, { useEffect, useRef, useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton, DatePicker } from 'office-ui-fabric-react'
import { HoverCard, HoverCardType } from 'office-ui-fabric-react/lib/HoverCard'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { useInvoiceContext } from '../../contexts'
import { currency, getFromStorage, getProducts } from '../../services/dbService'
import { getPdf, printPDF } from '../../services/pdfService'
import { getInvoiceSettings } from '../../services/settingsService'
import {
  DATE, defaultPrintSettings, ISET, MASKED, PAY_METHOD, PREVIEW, PRINT, ZERO,
} from '../../utils/constants'
import { makeHash, groupBy } from '../../utils/utils'
import Alert from '../Alert'
import HoverTotal from '../HoverTotal'
import InvoiceItems from '../InvoiceItems'
import InvoiceItemsTable from '../InvoiceItemsTable'
import InvoicePageFooter from '../InvoicePageFooter'
import './index.scss'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: 15 }

const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.05 },
  styles: { root: { width: deviceWidth * 0.3, display: 'flex', justifyContent: 'space-between' } },
}

const PdfPathError = {
  title: 'Error in Preview PDF Path',
  subText: 'Go to Settings -> Check if path to Bill PDF is valid.',
}

const Invoice = ({ showPdfPreview }) => {
  const [invoiceState, updateInvoiceState] = useInvoiceContext()

  const [invoiceItems, setInvoiceItems] = useState(invoiceState.invoiceItems ?? [])
  const [isInvoiceItemFormOpen, setIsInvoiceItemFormOpen] = useState(false)
  const [isGrossWeightNetWeight, setIsGrossWeightNetWeight] = useState(false)

  const openInvoiceItemsPanel = useConstCallback(() => setIsInvoiceItemFormOpen(true))

  const dismissInvoiceItemsPanel = useConstCallback(() => setIsInvoiceItemFormOpen(false))

  const invoiceSettings = getInvoiceSettings()

  const [hideAlert, setHideAlert] = useState(true)
  const [alertDetails, setAlertDetails] = useState({})

  const defaultInvoiceFields = () => {
    const defaultInvoice = {}
    defaultPrintSettings.forEach((item) => {
      defaultInvoice[item.name] = ''
    })

    return {
      ...defaultInvoice,
      'Invoice Number': getFromStorage('invoiceNumber', 'num'),
      'Invoice Date': new Date(),
    }
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
    [PAY_METHOD.CREDIT]: ZERO,
    [PAY_METHOD.CARD]: ZERO,
    [PAY_METHOD.UPI]: ZERO,
    [PAY_METHOD.CASH]: ZERO,
    interState: false,
  }

  const [invoice, setInvoice] = useState(invoiceState.invoice ?? defaultInvoiceFields())
  const [invoiceFooter, setInvoiceFooter] = useState(invoiceState.invoiceFooter
    ?? defaultInvoiceFooter)
  const [currentInvoiceItemIndex, setCurrentInvoiceItemIndex] = useState(null)

  useEffect(() => {
    updateInvoiceState({
      invoice, invoiceItems, invoiceFooter,
    })
  }, [invoice, invoiceItems, invoiceFooter])

  const hoverCard = useRef(null)

  const fetchPDF = async (mode = PRINT) => getPdf(
    { meta: invoice, items: invoiceItems, footer: invoiceFooter }, mode,
  )

  const resetForm = () => {
    setInvoiceItems([])
    setInvoice(defaultInvoiceFields())
    setInvoiceFooter(defaultInvoiceFooter)
  }

  const moveAhead = () => {
    localStorage.invoiceNumber = invoice['Invoice Number'] + 1
    resetForm()
  }

  const printAndMove = (_, includeBill) => {
    fetchPDF(includeBill && PREVIEW).then((pdfBytes) => {
      if (pdfBytes?.error) {
        setAlertDetails(PdfPathError)
        setHideAlert(false)
        return false
      }
      return printPDF(pdfBytes)
    }).then((oneGone) => {
      if (oneGone && getFromStorage('printBoth')) {
        fetchPDF(PREVIEW).then((pdfBytes) => {
          if (pdfBytes?.error) {
            setAlertDetails(PdfPathError)
            setHideAlert(false)
            return
          }
          printPDF(pdfBytes).then((fin) => {
            if (fin) {
              moveAhead()
            }
          })
        })
      } else if (oneGone) {
        moveAhead()
      }
    })
  }

  const printWithBill = (e) => {
    printAndMove(e, true)
  }

  const previewPDF = () => {
    fetchPDF(PREVIEW).then((pdfBytes) => {
      if (pdfBytes?.error) {
        setAlertDetails(PdfPathError)
        setHideAlert(false)
        return
      }
      showPdfPreview(pdfBytes)
    })
  }

  const addInvoiceItem = (invoiceItem) => {
    setInvoiceItems([...invoiceItems, invoiceItem])
  }

  const updateInvoiceFooter = (change) => {
    let updatedInvoiceFooter = invoiceFooter
    if (change) {
      updatedInvoiceFooter = { ...invoiceFooter, ...change }
    }
    const {
      oldPurchase, grossTotal, cheque, card, upi, interState, credit,
    } = updatedInvoiceFooter
    const calcSettings = getInvoiceSettings(ISET.CALC)
    const cgst = interState
      ? 0 : grossTotal * 0.01 * currency(calcSettings.cgst)
    const sgst = interState
      ? 0 : grossTotal * 0.01 * currency(calcSettings.sgst)
    const igst = interState
      ? grossTotal * 0.01 * currency(calcSettings.igst) : 0
    const totalAmount = currency(grossTotal + cgst + sgst + igst)
    setInvoiceFooter({
      ...updatedInvoiceFooter,
      grossTotal: currency(grossTotal),
      cgst,
      sgst,
      igst,
      totalAmount,
      grandTotal: currency(totalAmount - oldPurchase),
      cash: currency(totalAmount - oldPurchase - card - cheque - upi - credit),
    })
  }

  const calcInvoiceFooter = (items) => {
    let grossTotal = ZERO
    let oldPurchase = ZERO
    items.forEach((item) => {
      if (!item.isOldItem) {
        grossTotal += currency(item.totalPrice)
      } else {
        oldPurchase += currency(item.totalPrice)
      }
    })

    updateInvoiceFooter({ grossTotal, oldPurchase })
  }

  const removeInvoiceItem = (id) => {
    const filteredItems = invoiceItems.filter((item) => item.id !== id)
    setInvoiceItems(filteredItems)
    calcInvoiceFooter(filteredItems)
    dismissInvoiceItemsPanel()
  }

  const dismissInvoiceItemsPanelAndRemoveEmptyItems = () => {
    // remove items without baap on panel dismiss
    const filteredItems = invoiceItems.filter((item) => {
      if (!item.isOldItem) return !!item.product
      return !!item.type
    })
    setInvoiceItems(filteredItems)
    dismissInvoiceItemsPanel()
    calcInvoiceFooter(filteredItems)
  }

  const updateInvoiceItem = (index, valueObject) => {
    let grossTotal = ZERO
    let oldPurchase = ZERO

    setInvoiceItems(invoiceItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, ...valueObject }
        if (valueObject.product && item.product !== valueObject.product) {
          newItem.price = getProducts(newItem.product).price
        }
        if (valueObject.isOldItem) {
          newItem.quantity = 1
          newItem.product = null
          newItem.other = ZERO
          newItem.mkg = ZERO
        }
        // The logic is price*weight + %MKG + other
        const totalPrice = currency(currency(newItem.price) * newItem.weight
        * (1 + 0.01 * currency(newItem.mkg)) + currency(newItem.other))

        if (!newItem.isOldItem) {
          grossTotal += totalPrice
        } else {
          oldPurchase += totalPrice
        }

        return {
          ...newItem,
          totalPrice,
        }
      }

      if (!item.isOldItem) {
        grossTotal += currency(item.totalPrice)
      } else {
        oldPurchase += currency(item.totalPrice)
      }
      return item
    }))
    updateInvoiceFooter({ grossTotal, oldPurchase })
  }

  const addNewInvoiceItem = () => {
    const newItemId = makeHash()
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
      // old item fields
      isOldItem: false,
      type: null,
      purity: ZERO,
    })
    setCurrentInvoiceItemIndex(invoiceItems.length)
    openInvoiceItemsPanel()
  }

  const editInvoiceItem = (id) => {
    setCurrentInvoiceItemIndex(invoiceItems.findIndex((item) => item.id === id))
    openInvoiceItemsPanel()
  }

  const groupedSettings = groupBy(invoiceSettings, 'row')

  const getFilteredInvoiceItems = () => invoiceItems
    .filter((item) => !item.isOldItem && item.product)

  const getOldInvoiceItems = () => invoiceItems.filter((item) => item.isOldItem && item.type)

  const validateInvoiceField = (field) => {
    if (field.disabled) return true

    if (!invoice[field.name]) return false

    if (field.inputLength) return invoice[field.name].length === field.inputLength

    if (field.regex
      && !new RegExp(field.regex).test(invoice[field.name].toUpperCase())) return false

    return true
  }

  const validateMandatoryMeta = () => !invoiceSettings
    .some((field) => field.required && !validateInvoiceField(field))

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="animation-slide-up invoice">
      <Alert
        hide={hideAlert}
        setHideAlert={setHideAlert}
        {...alertDetails}
      />
      <Stack
        horizontal
        className="invoice__container"
      >
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
                  prefix: field.prefix,
                  onChange: (_, val) => {
                    if (field.inputLength && val.length > field.inputLength) return
                    setInvoice({ ...invoice, [field.name]: val })
                    if (field.name.includes('GST') && getFromStorage('nativeGstinPrefix') && val.length > 2) {
                      setInvoiceFooter({
                        ...invoiceFooter,
                        interState: invoice[field.name].substr(0, 2) !== getFromStorage('nativeGstinPrefix'),
                      })
                    }
                  },
                  onGetErrorMessage: (value) => {
                    if (!value) return
                    if (!validateInvoiceField(field)) return `Invalid Value For ${field.name}`
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
            items={getFilteredInvoiceItems()}
            removeInvoiceItem={removeInvoiceItem}
            editInvoiceItem={editInvoiceItem}
          />
          <hr />
          {getOldInvoiceItems().length > 0 && (
            <InvoiceItemsTable
              oldItemsTable
              items={getOldInvoiceItems()}
              removeInvoiceItem={removeInvoiceItem}
              editInvoiceItem={editInvoiceItem}
            />
          )}
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
              disabled={invoiceItems.some((item) => item.isOldItem)
                || (!invoiceItems.some((item) => item.isOldItem)
                && !getFromStorage('oldPurchaseFreedom'))}
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
      <InvoicePageFooter
        disablePrintButton={!validateMandatoryMeta()}
        printAndMove={printAndMove}
        printWithBill={printWithBill}
        previewPDF={previewPDF}
        resetForm={resetForm}
      />
      <Panel
        isLightDismiss
        className="invoice__item-panel"
        headerClassName="invoice__item-panel__header"
        isOpen={isInvoiceItemFormOpen}
        onDismiss={dismissInvoiceItemsPanelAndRemoveEmptyItems}
        closeButtonAriaLabel="Close"
        headerText="Invoice item"
      >
        <InvoiceItems
          isGrossWeightNetWeight={isGrossWeightNetWeight}
          setIsGrossWeightNetWeight={setIsGrossWeightNetWeight}
          invoiceItems={invoiceItems}
          currentInvoiceItemIndex={currentInvoiceItemIndex}
          currentInvoiceItem={invoiceItems[currentInvoiceItemIndex]}
          setInvoiceItems={setInvoiceItems}
          removeInvoiceItem={removeInvoiceItem}
          updateInvoiceItem={updateInvoiceItem}
          dismissInvoiceItemsPanel={dismissInvoiceItemsPanelAndRemoveEmptyItems}
          addNewInvoiceItem={addNewInvoiceItem}
        />
      </Panel>
    </div>
  )
}

export default Invoice
