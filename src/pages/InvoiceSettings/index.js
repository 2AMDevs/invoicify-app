import React, { useState } from 'react'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { fieldTypes, MASKED } from '../../utils/constants'
import { getInvoiceSettings } from '../../utils/helper'

const deviceWidth = document.documentElement.clientWidth

const InvoiceSettings = () => {
  const settings = getInvoiceSettings()
  const [currentSettings, setCurrentSettings] = useState(settings)
  const handleChange = (index, key, value) => {
    const newSettings = [...currentSettings]
    newSettings[index][key] = value
    setCurrentSettings(newSettings)
    localStorage.setItem('invoiceSettings', JSON.stringify(newSettings))
  }
  return (
    <>
      { currentSettings.map((setting, idx) => (
        <Stack
          horizontal
          {...{
            tokens: { childrenGap: deviceWidth * 0.02 },
            styles: { root: { width: deviceWidth * 0.9 } },
          }}
          key={setting.name.toLowerCase()}
        >
          <TextField
            label="Field Name"
            onChange={(_, val) => handleChange(idx, 'name', val)}
            value={setting.name}
          />
          <TextField
            label="X Co-ordinate"
            onChange={(_, val) => handleChange(idx, 'x', val)}
            value={setting.x}
          />
          <TextField
            label="Y Co-ordinate"
            onChange={(_, val) => handleChange(idx, 'y', val)}
            value={setting.y}
          />
          <Toggle
            label="Required?"
            checked={setting.required}
            onChange={(_, val) => handleChange(idx, 'required', val)}
          />
          <Toggle
            label="Disabled?"
            checked={setting.disabled}
            onChange={(_, val) => handleChange(idx, 'disabled', val)}
          />
          <Dropdown
            label="Type"
            options={fieldTypes}
            value={setting.type}
            selectedKey={setting.type}
            onChange={(_, val) => handleChange(idx, 'type', val.key)}
          />
          { setting.type === MASKED
            ? (
              <TextField
                label="Mask"
                value={setting.mask}
                onChange={(_, val) => handleChange(idx, 'mask', val.key)}
              />
            ) : ''}
        </Stack>
      ))}
    </>
  )
}

export default InvoiceSettings