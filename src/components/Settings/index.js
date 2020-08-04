import React, { useState } from 'react'

import { DefaultButton } from 'office-ui-fabric-react'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { getFromStorage, resetSettings } from '../../utils/helper'

const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: '40rem' } }

const Settings = () => {
  const [previewBill, setPreviewBill] = useState(getFromStorage('previewPDFUrl'))
  const [productType, setProductType] = useState(getFromStorage('productType'))
  const [invoiceNumber, setInvoiceNumber] = useState(getFromStorage('invoiceNumber'))
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [hindiDate, setHindiDate] = useState(getFromStorage('hindiDate'))

  const onClickUpdates = (_, checked) => {
    localStorage.hindiDate = checked
    setHindiDate(checked)
  }

  const onNameChange = (_, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
  }

  const onInvoiceNoChange = (_, newValue) => {
    localStorage.invoiceNumber = newValue
    setInvoiceNumber(newValue)
  }

  const fileSelected = async () => {
    // eslint-disable-next-line global-require
    const { ipcRenderer } = require('electron')
    const path = await ipcRenderer.invoke('select-file')
    if (path) {
      setPreviewBill(path)
      localStorage.previewPDFUrl = path
    }
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
        <TextField
          label="Bill File Path"
          disabled
          value={previewBill}
        />
        <DefaultButton
          text="Select PDF"
          iconProps={{ iconName: 'PDF' }}
          primary
          onClick={fileSelected}
          styles={{ root: { width: '15rem' } }}
        />
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
          onChange={onClickUpdates}
        />
        <DefaultButton
          text="Reset Settings"
          iconProps={{ iconName: 'FullHistory' }}
          primary
          onClick={resetSettings}
          styles={{ root: { width: '18rem' } }}
        />
      </Stack>
    </div>
  )
}

export default Settings
