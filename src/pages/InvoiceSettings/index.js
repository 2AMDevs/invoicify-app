import React, { useState } from 'react'

import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'
import { Separator } from 'office-ui-fabric-react/lib/Separator'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import {
  fieldTypes, MASKED, ISET,
} from '../../utils/constants'
import { getInvoiceSettings, titleCase } from '../../utils/helper'

import './index.scss'

const deviceWidth = document.documentElement.clientWidth
const token = {
  tokens: { childrenGap: deviceWidth * 0.02 },
  styles: { root: { width: deviceWidth * 0.9 } },
}

const InvoiceSettings = () => {
  const [currentSettings, setCurrentSettings] = useState(getInvoiceSettings())
  const [printSettings, setPrintSettings] = useState(getInvoiceSettings(ISET.PRINT))
  const [calcSettings, setCalcSettings] = useState(getInvoiceSettings(ISET.CALC))
  const [footerPrintSettings, setFooterPrintSettings] = useState(getInvoiceSettings(ISET.FOOTER))

  const getNewSettings = (type) => {
    if (type === ISET.PRINT) return { ...printSettings }
    if (type === ISET.CALC) return { ...calcSettings }
    if (type === ISET.FOOTER) return { ...footerPrintSettings }
    return [...currentSettings]
  }

  const handleChange = (index, key, value, type = ISET.MAIN) => {
    const newSettings = getNewSettings(type)

    if (type !== ISET.MAIN) {
      newSettings[key] = value
      if (type === ISET.PRINT) {
        setPrintSettings(newSettings)
      } else if (type === ISET.CALC) {
        setCalcSettings(newSettings)
      } else if (type === ISET.FOOTER) {
        setFooterPrintSettings(newSettings)
      }
    } else {
      newSettings[index][key] = value
      setCurrentSettings(newSettings)
    }
    localStorage.setItem(type, JSON.stringify(newSettings))
  }

  return (
    <div className="animation-slide-up invoice-settings">
      <Separator alignContent="start">Invoice Meta</Separator>
      <br />
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
            disabled={setting.disableNameChange}
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

      <br />
      <Separator alignContent="start">Invoice Item & Copy Mark</Separator>
      <br />

      <Stack
        horizontal
        {...token}
        key="Extra"
      >
        {Object.keys(printSettings).map((key) => (
          <TextField
            label={titleCase(key)}
            key={key}
            onChange={(_, val) => handleChange(0, key, parseFloat(val), ISET.PRINT)}
            value={printSettings[key]}
          />
        ))}
      </Stack>

      <br />
      <Separator alignContent="start">Invoice Footer</Separator>
      <br />

      <Stack
        key="Footer Stuff"
      >
        {Object.keys(footerPrintSettings).map((key) => (
          <Stack
            horizontal
            {...token}
            key={key}
          >
            {Object.keys(footerPrintSettings[key]).map((subkey) => (
              <TextField
                label={`${subkey.toUpperCase()} (${titleCase(key)})`}
                key={`${key} ${subkey}`}
                onChange={(_, val) => handleChange(0, key,
                  {
                    ...footerPrintSettings[key],
                    // eslint-disable-next-line no-restricted-globals
                    [subkey]: isNaN(parseFloat(val)) ? 0 : parseFloat(val),
                  }, ISET.FOOTER)}
                value={footerPrintSettings[key][subkey]}
              />
            ))}
          </Stack>
        ))}
      </Stack>

      <br />
      <Separator alignContent="start">Calculation Settings</Separator>
      <br />

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
      <br />
    </div>
  )
}

export default InvoiceSettings
