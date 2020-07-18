import React, { useEffect, useState } from 'react'

import { DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import print from 'print-js'

import {
  PREVIEW, PRINT, DATE, MASKED,
} from '../../utils/constants'
import { getFromStorage, getPdf, getInvoiceSettings } from '../../utils/helper'

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

  const fetchPDF = async (mode = PRINT) => getPdf(invoice, mode)

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const resetForm = () => {
    setInvoice({ 'Invoice Number': invoiceNumber, 'Invoice Date': new Date() })
  }

  const printAndMove = async () => {
    const pdfBytes = await fetchPDF()
    print({ printable: pdfBytes, type: 'pdf', base64: true })
    setInvoiceNumber(invoiceNumber + 1)
    // resetForm()
  }

  const previewPDF = async () => {
    const pdfBytes = await fetchPDF(PREVIEW)
    setPreview(pdfBytes)
  }

  // Update Preview on blur
  const handleInputBlur = () => previewPDF()

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <>
      <Stack
        vertical
        tokens={stackTokens}
        styles={stackStyles}
      >
        { invoiceSettings.map((field) => {
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
    </>
  )
}

export default Invoice
