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
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [checkForUpdates, setCheckForUpdates] = useState(getFromStorage('checkForUpdates'))

  const onClick = (ev, checked) => {
    localStorage.settingsOne = checked
    setSettingsOne(checked)
  }

  const onClickUpdates = (ev, checked) => {
    localStorage.checkForUpdates = checked
    setCheckForUpdates(checked)
  }

  const onNameChange = (ev, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
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
