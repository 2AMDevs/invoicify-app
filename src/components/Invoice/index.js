import React, { useEffect, useState } from 'react'

import { DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'

import {
  PREVIEW, PRINT, DATE, MASKED,
} from '../../utils/constants'
import {
  getFromStorage, getPdf, getInvoiceSettings, printPDF,
} from '../../utils/helper'
import InvoiceItems from '../InvoiceItems'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: deviceWidth * 0.5 } }

// TODO: Re-enable this after form is customizable with layout too.
// const columnProps = {
//   tokens: { childrenGap: deviceWidth * 0.07 },
//   styles: { root: { width: deviceWidth * 0.4 } },
// }

const Invoice = ({ setPreview }) => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  const invoiceSettings = getInvoiceSettings()

  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber)
  const [invoice, setInvoice] = useState({ 'Invoice Number': invoiceNumber, 'Invoice Date': new Date() })
  const [invoiceItems, setInvoiceItems] = useState([])

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const fetchPDF = async (mode = PRINT) => getPdf({ meta: invoice, items: invoiceItems }, mode)

  const resetForm = () => {
    setInvoice({ 'Invoice Number': invoiceNumber, 'Invoice Date': new Date() })
  }

  const printAndMove = async () => {
    const pdfBytes = await fetchPDF()
    printPDF(pdfBytes)
    setInvoiceNumber(invoiceNumber + 1)
    resetForm()
  }

  const previewPDF = async () => {
    const pdfBytes = await fetchPDF(PREVIEW)
    setPreview(pdfBytes)
  }

  // Update Preview on blur
  const handleInputBlur = () => previewPDF()

  const addInvoiceItem = (invoiceItem) => {
    setInvoiceItems([...invoiceItems, invoiceItem])
    previewPDF()
  }

  const removeInvoiceItem = (id) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id))
  }

  const updateInvoiceItem = (index, valueObject) => {
    setInvoiceItems(invoiceItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, ...valueObject }
        return { ...newItem, totalPrice: newItem.price * newItem.quantity }
      }
      return item
    }))
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="animation-slide-up">
      <Stack
        vertical
        tokens={stackTokens}
        styles={stackStyles}
      >
        {invoiceSettings.map((field) => {
          const props = {
            label: field.name,
            key: field.name,
            value: invoice[field.name],
            onChange: (_, val) => {
              setInvoice({ ...invoice, [field.name]: val })
            },
            onBlur: handleInputBlur,
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
        <InvoiceItems
          invoiceItems={invoiceItems}
          setInvoiceItems={setInvoiceItems}
          addInvoiceItem={addInvoiceItem}
          removeInvoiceItem={removeInvoiceItem}
          updateInvoiceItem={updateInvoiceItem}
        />
        <br />
        <Stack
          horizontal
          tokens={stackTokens}
        >
          <DefaultButton
            text="Print"
            iconProps={{ iconName: 'print' }}
            primary
            onClick={printAndMove}
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
      <iframe
        title="Hidden"
        id="hidden-frame"
      />
    </div>
  )
}

export default Invoice
