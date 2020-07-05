import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { DatePicker } from 'office-ui-fabric-react'

import React from 'react'
import './index.scss'

const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: 650 } }
const columnProps = {
  tokens: { childrenGap: 100 },
  styles: { root: { width: 650 } },
}

const HomePage = () => (
  <div className="home-page">
    <Stack
      vertical
      tokens={stackTokens}
      styles={stackStyles}
    >
      <Stack
        horizontal
        {...columnProps}
      >
        <TextField
          label="Invoice No."
          disabled
          defaultValue="D001"
        />
        <DatePicker
          isRequired
          value={new Date()}
          label="Date"
          placeholder="Select a date..."
          ariaLabel="Select a date"
        />
      </Stack>
      <TextField
        required
        label="Customer Name"
      />
      <Stack
        horizontal
        {...columnProps}
      >
        <MaskedTextField
          label="Party GSTIN"
          mask="99-**********-*Z*"
        />
        <MaskedTextField
          label="Mobile Number"
          mask="+\91 9999999999"
        />
        <Checkbox
          label="Same State (Raj.)"
          // onChange={_onChange}
        />
      </Stack>
      <Stack {...columnProps}>
        <TextField
          label="Party Address"
          placeholder="Nimbahera"
        />
      </Stack>
    </Stack>
  </div>
// TODO: npm install convert-rupees-into-words
)

export default HomePage
