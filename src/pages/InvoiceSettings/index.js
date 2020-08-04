import React, { useState } from 'react'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import { fieldTypes, MASKED, ISET } from '../../utils/constants'
import { getInvoiceSettings, titleCase } from '../../utils/helper'

const deviceWidth = document.documentElement.clientWidth
const token = {
  tokens: { childrenGap: deviceWidth * 0.02 },
  styles: { root: { width: deviceWidth * 0.9 } },
}

const InvoiceSettings = () => {
  const [currentSettings, setCurrentSettings] = useState(getInvoiceSettings())
  const [printSettings, setPrintSettings] = useState(getInvoiceSettings(ISET.PRINT))
  const [calcSettings, setCalcSettings] = useState(getInvoiceSettings(ISET.CALC))

  const getNewSettings = (type) => {
    if (type === ISET.PRINT) return { ...printSettings }
    if (type === ISET.CALC) return { ...calcSettings }

    return [...currentSettings]
  }

  const handleChange = (index, key, value, type = ISET.MAIN) => {
    const newSettings = getNewSettings(type)

    if (type !== ISET.MAIN) {
      newSettings[key] = value
      if (type === ISET.PRINT) {
        setPrintSettings(newSettings)
      } else {
        setCalcSettings(newSettings)
      }
    } else {
      newSettings[index][key] = value
      setCurrentSettings(newSettings)
    }
    localStorage.setItem(type, JSON.stringify(newSettings))
  }

  return (
    <div className="animation-slide-up">
      {currentSettings.map((setting, idx) => (
        <Stack
          horizontal
          {...token}
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
        >
          <TextField
            label="Field Name"
            onChange={(_, val) => handleChange(idx, 'name', val)}
            value={setting.name}
          />
          <TextField
            label="Row Number"
            onChange={(_, val) => handleChange(idx, 'row', val)}
            value={setting.row}
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
          <TextField
            label="Font Size"
            onChange={(_, val) => handleChange(idx, 'size', val)}
            value={setting.size}
          />
          { setting.type === MASKED
            ? (
              <TextField
                label="Mask"
                value={setting.mask}
                onChange={(_, val) => handleChange(idx, 'mask', val)}
              />
            ) : ''}
        </Stack>
      ))}
      <Stack
        horizontal
        {...token}
        key="Extra"
      >
        {Object.keys(printSettings).map((key) => (
          <TextField
            label={titleCase(key)}
            key={key}
            onChange={(_, val) => handleChange(0, key, val, ISET.PRINT)}
            value={printSettings[key]}
          />
        ))}
      </Stack>
      <Stack
        horizontal
        {...token}
        key="Calculation"
      >
        {Object.keys(calcSettings).map((key) => (
          <TextField
            label={key?.includes('gst') ? `${key.toUpperCase()} (%)` : titleCase(key)}
            key={key}
            onChange={(_, val) => handleChange(0, key, val, ISET.CALC)}
            value={calcSettings[key]}
          />
        ))}
      </Stack>
    </div>
  )
}

export default InvoiceSettings
