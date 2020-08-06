import React, { useState } from 'react'

import { DefaultButton } from 'office-ui-fabric-react'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { FILE_TYPE } from '../../utils/constants'
import { getFromStorage, resetSettings } from '../../utils/helper'

import './index.scss'

// eslint-disable-next-line global-require
const { ipcRenderer } = require('electron')

const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: '40rem' } }

const Settings = ({ refreshCompanyName }) => {
  const [previewBill, setPreviewBill] = useState(getFromStorage('previewPDFUrl'))
  const [productType, setProductType] = useState(getFromStorage('productType'))
  const [printer, setPrinter] = useState(getFromStorage('printer'))
  const [invoiceNumber, setInvoiceNumber] = useState(getFromStorage('invoiceNumber'))
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [hindiDate, setHindiDate] = useState(getFromStorage('hindiDate'))
  const [font, setFont] = useState(getFromStorage('customFont'))

  const onDateLangChange = (_, checked) => {
    localStorage.hindiDate = checked
    setHindiDate(checked)
  }

  const onPrinterChange = (_, val) => {
    localStorage.printer = val.key
    setPrinter(val.key)
  }

  const onNameChange = (_, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
    if (refreshCompanyName) refreshCompanyName()
  }

  const onInvoiceNoChange = (_, newValue) => {
    localStorage.invoiceNumber = newValue
    setInvoiceNumber(newValue)
  }

  const fileSelected = async (type) => {
    const path = await ipcRenderer.invoke('select-file')
    if (path) {
      if (type === FILE_TYPE.PDF) {
        setPreviewBill(path)
      } else if (type === FILE_TYPE.FONT) {
        setFont(path)
      }
      localStorage.setItem(type, path)
    }
  }

  const resetAndUpdate = () => {
    resetSettings()
    setPreviewBill(getFromStorage('previewPDFUrl'))
    setProductType(getFromStorage('productType'))
    setInvoiceNumber(getFromStorage('invoiceNumber'))
    setCompanyName(getFromStorage('companyName'))
    setHindiDate(getFromStorage('hindiDate'))
  }

  const onProductTypeChange = (_, newValue) => {
    localStorage.productType = newValue
    setProductType(newValue)
  }

  return (
    <div className="settings animation-slide-up">
      <Stack
        className="invoice-page"
        tokens={stackTokens}
        styles={stackStyles}
      >
        <TextField
          label="Company Name"
          onChange={onNameChange}
          value={companyName}
        />
        <TextField
          label="Next Invoice Number"
          onChange={onInvoiceNoChange}
          value={invoiceNumber}
        />
        <Dropdown
          label="Select Printer"
          selectedKey={printer}
          onChange={onPrinterChange}
          options={getFromStorage('printers') && JSON.parse(getFromStorage('printers'))}
        />
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            className="invoice-page__path-input"
            placeholder="Bill File Path"
            disabled
            value={previewBill}
          />
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Bill"
            iconProps={{ iconName: 'PDF' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.PDF)}
          />
        </Stack>
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            className="invoice-page__path-input"
            placeholder="Font Path"
            disabled
            value={font}
          />
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Font"
            iconProps={{ iconName: 'Font' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.FONT)}
          />
        </Stack>
        <TextField
          label="Product Types"
          onChange={onProductTypeChange}
          value={productType}
        />
        <Toggle
          label="Date Language"
          checked={hindiDate}
          onText="हिन्दी"
          offText="English"
          onChange={onDateLangChange}
        />
        <DefaultButton
          text="Reset Settings"
          iconProps={{ iconName: 'FullHistory' }}
          primary
          onClick={resetAndUpdate}
          styles={{ root: { width: '18rem' } }}
        />
      </Stack>
    </div>
  )
}

export default Settings
