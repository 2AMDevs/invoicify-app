import React from 'react'

import { TextField, Toggle, Dropdown } from 'office-ui-fabric-react'

import {
  fieldTypes, MASKED,
} from '../../../utils/constants'

import './index.scss'
import { round } from '../../../utils/utils'

const MiddleSection = ({
  setting, handleChange, idx,
}) => {
  if (!setting) {
    return (
      <div className="middle-section__not-selected">
        Select a field from left panel to start customizing the invoice.
      </div>
    )
  }

  return (
    <div className="middle-section">
      <div className="middle-section__row">
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
      </div>
      <div className="middle-section__row">
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
      </div>
      <div className="middle-section__row">
        <TextField
          label="X Co-ordinate"
          onChange={(_, val) => handleChange(idx, 'x', val)}
          value={round(setting.x, 2)}
        />
        <TextField
          label="Y Co-ordinate"
          onChange={(_, val) => handleChange(idx, 'y', val)}
          value={round(setting.y, 2)}
        />
      </div>

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

      {setting.type === MASKED
        ? (
          <TextField
            label="Mask"
            value={setting.mask}
            onChange={(_, val) => handleChange(idx, 'mask', val)}
          />
        ) : ''}
    </div>
  )
}

export default MiddleSection
