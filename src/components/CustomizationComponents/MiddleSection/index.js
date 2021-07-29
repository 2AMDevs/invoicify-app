import React from 'react'

import { TextField, Toggle, Dropdown } from 'office-ui-fabric-react'

import {
  fieldTypes, MASKED,
} from '../../../utils/constants'

import './index.scss'

const MiddleSection = ({
  setting, handleChange, idx,
}) => {
  if (!setting) {
    return (
      <div className="middle-section">
        empty
      </div>
    )
  }

  return (
    <div className="middle-section">
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
