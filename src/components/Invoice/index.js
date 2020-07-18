import React, { useEffect, useState } from 'react'

import { DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import print from 'print-js'

import { PREVIEW, PRINT } from '../../utils/constants'
import { getFromStorage, getPdf, getInvoiceSettings } from '../../utils/helper'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: deviceWidth * 0.5 } }
const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.07 },
  styles: { root: { width: deviceWidth * 0.4 } },
}

const Invoice = ({ setPreview }) => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  const invoiceSettings = getInvoiceSettings()

  const [invoice, setInvoice] = useState({})
  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber)

  const fetchPDF = async (mode = PRINT) => getPdf(invoice, mode)

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const resetForm = () => {
    setInvoice({})
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
    <div>
      <Stack
        vertical
        tokens={stackTokens}
        styles={stackStyles}
      >
        { invoiceSettings.map((field) => (
          <TextField
            label={field.name}
            key={field.name}
            value={invoice[field.name] || ''}
            onChange={(_, val) => {
              setInvoice({ ...invoice, [field.name]: val })
            }}
            onBlur={handleInputBlur}
          />
        )) }
        {/* <Stack
          horizontal
          {...columnProps}
        >
          <TextField
            label="Invoice No."
            disabled
            value={invoiceNumber}
          />
          <DatePicker
            isRequired
            value={new Date()}
            label="Date"
            onBlur={handleInputBlur}
            placeholder="Select a date..."
            ariaLabel="Select a date"
          />
        </Stack>
        <TextField
          required
          label="Customer Name"
          value={customerName}
          onChange={(_event, val) => setCustomerName(val)}
          onBlur={handleInputBlur}
        />
        <Stack
          horizontal
          {...columnProps}
        >
          <MaskedTextField
            label="Customer GSTIN"
            mask="99-**********-***"
            value={gstin}
            onChange={(_event, val) => setGstin(val)}
            onBlur={handleInputBlur}
          />
          <MaskedTextField
            label="Mobile No."
            mask="+\91 9999999999"
            value={mobile.substr(3)}
            onChange={(_event, val) => setMobile(val)}
            onBlur={handleInputBlur}
          />
        </Stack>
        <Stack {...columnProps}>
          <TextField
            label="Customer Address"
            value={address}
            onChange={(_event, val) => setAddress(val)}
            onBlur={handleInputBlur}
          />
        </Stack> */}
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
    </div>
  )
}

export default Invoice
