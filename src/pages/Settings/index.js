import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import React, { useState } from 'react'
import { getFromStorage } from '../../helper/helper'

const stackTokens = { childrenGap: 15 }
const deviceWidth = document.documentElement.clientWidth
const stackStyles = { root: { width: deviceWidth * 0.7 } }

const Settings = () => {
  const [settingsOne, setSettingsOne] = useState(getFromStorage('settingsOne'))
  const [invoiceNumber, setInvoiceNumber] = useState(getFromStorage('invoiceNumber'))
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [checkForUpdates, setCheckForUpdates] = useState(getFromStorage('checkForUpdates'))

  const onClick = (_event, checked) => {
    localStorage.settingsOne = checked
    setSettingsOne(checked)
  }

  const onClickUpdates = (_event, checked) => {
    localStorage.checkForUpdates = checked
    setCheckForUpdates(checked)
  }

  const onNameChange = (_event, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
  }

  const onInvoiceNoChange = (_event, newValue) => {
    localStorage.invoiceNumber = newValue
    setInvoiceNumber(newValue)
  }

  return (
    <Stack
      className="invoice-page"
      tokens={stackTokens}
      styles={stackStyles}
    >
      <TextField
        label="Company Name"
        defaultValue="Default Company"
        onChange={onNameChange}
        value={companyName}
      />
      <TextField
        label="Next Invoice Number"
        defaultValue="001"
        onChange={onInvoiceNoChange}
        value={invoiceNumber}
      />
      <Toggle
        label={'Setting 1'}
        checked={settingsOne}
        onText="On"
        offText="Off"
        onChange={onClick}
      />
      <Toggle
        label="Automatically Check for Updates"
        checked={checkForUpdates}
        onText="On"
        offText="Off"
        onChange={onClickUpdates}
      />
    </Stack>
  )
}

export default Settings
