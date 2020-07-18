import React, { useState } from 'react'

import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { getFromStorage } from '../../utils/helper'

const stackTokens = { childrenGap: 15 }
const deviceWidth = document.documentElement.clientWidth
const stackStyles = { root: { width: deviceWidth * 0.7 } }

const Settings = () => {
  const [previewBill, setPreviewBill] = useState(getFromStorage('previewPDFUrl'))
  const [productType, setProductType] = useState(getFromStorage('productType'))
  const [invoiceNumber, setInvoiceNumber] = useState(getFromStorage('invoiceNumber'))
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [checkForUpdates, setCheckForUpdates] = useState(getFromStorage('checkForUpdates'))

  const onClickUpdates = (_, checked) => {
    localStorage.checkForUpdates = checked
    setCheckForUpdates(checked)
  }

  const onNameChange = (_, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
  }

  const onInvoiceNoChange = (_, newValue) => {
    localStorage.invoiceNumber = newValue
    setInvoiceNumber(newValue)
  }

  const onBillURLChange = (_, newValue) => {
    localStorage.previewPDFUrl = newValue
    setPreviewBill(newValue)
  }

  const onProductTypeChange = (_, newValue) => {
    localStorage.productType = newValue
    setProductType(newValue)
  }

  return (
    <>
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
          label="Preview Bill URL"
          onChange={onBillURLChange}
          value={previewBill}
        />
        <TextField
          label="Product Types"
          onChange={onProductTypeChange}
          value={productType}
        />
        <Toggle
          label="Automatically Check for Updates"
          checked={checkForUpdates}
          onText="On"
          offText="Off"
          onChange={onClickUpdates}
        />
      </Stack>
    </>
  )
}

export default Settings
