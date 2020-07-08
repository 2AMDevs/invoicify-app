import { DatePicker, DefaultButton } from 'office-ui-fabric-react'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import React, { useState, useEffect } from 'react'
import {
  PDFDocument, StandardFonts,
} from 'pdf-lib'
import { getFromStorage, downloadPDF, getInvoiceDate } from '../../helper/helper'
import './index.scss'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: deviceWidth * 0.7 } }
const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.07 },
  styles: { root: { width: deviceWidth * 0.7 } },
}

const HomePage = () => {
  const nextInvoiceNumber = getFromStorage('invoiceNumber', 'num')
  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber)
  const [customerName, setCustomerName] = useState('')
  const [gstin, setGstin] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    localStorage.invoiceNumber = invoiceNumber
  }, [invoiceNumber])

  const resetForm = () => {
    setCustomerName('')
    setGstin('')
    setMobile('')
    setAddress('')
  }

  const printAndMove = async () => {
    let pdfDoc
    const previewURL = getFromStorage('previewPDFUrl')
    if (previewURL) {
      const existingPdfBytes = await fetch(previewURL).then((res) => res.arrayBuffer())
      pdfDoc = await PDFDocument.load(existingPdfBytes)
    } else {
      pdfDoc = await PDFDocument.create()
    }

    // Embed the Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const fontSize = 11

    const page = previewURL ? pdfDoc.getPages()[0] : pdfDoc.addPage()

    // Get the width and height of the first page
    const { width, height } = page.getSize()

    // Draw a string of text diagonally across the first page
    page.drawText(invoiceNumber.toString(), {
      x: 90,
      y: height / 2 + 273,
      size: fontSize,
      font,
    })

    page.drawText(getInvoiceDate(), {
      x: width - 110,
      y: height / 2 + 275,
      size: fontSize,
      font,
    })

    page.drawText(customerName, {
      x: 60,
      y: height / 2 + 250,
      size: fontSize,
      font,
    })

    page.drawText(gstin, {
      x: 100,
      y: height / 2 + 223,
      size: fontSize,
      font,
    })

    page.drawText(mobile, {
      x: width - 130,
      y: height / 2 + 223,
      size: fontSize,
      font,
    })

    page.drawText(address, {
      x: 325,
      y: height / 2 + 223,
      size: fontSize,
      font,
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    downloadPDF(pdfBytes, invoiceNumber)

    setInvoiceNumber(invoiceNumber + 1)
    // resetForm()
  }

  return (
    <div className="home-page">
      <Stack
        vertical
        tokens={stackTokens}
        styles={stackStyles}
      >
        <Stack
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
            placeholder="Select a date..."
            ariaLabel="Select a date"
          />
        </Stack>
        <TextField
          required
          label="Customer Name"
          value={customerName}
          onChange={(_event, val) => setCustomerName(val)}
        />
        <Stack
          horizontal
          {...columnProps}
        >
          <MaskedTextField
            label="Customer GSTIN"
            mask="99-**********-*Z*"
            value={gstin.substr(0, gstin.length - 2)}
            onChange={(_event, val) => setGstin(val)}
          />
          <MaskedTextField
            label="Mobile No."
            mask="+\91 9999999999"
            value={mobile.substr(3)}
            onChange={(_event, val) => setMobile(val)}
          />
        </Stack>
        <Stack {...columnProps}>
          <TextField
            label="Customer Address"
            value={address}
            onChange={(_event, val) => setAddress(val)}
          />
        </Stack>
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
  // TODO: npm install convert-rupees-into-words
  )
}

export default HomePage
