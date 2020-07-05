import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { MaskedTextField, TextField } from 'office-ui-fabric-react/lib/TextField'
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { DatePicker } from 'office-ui-fabric-react'

import React from 'react'
import './index.scss'

const deviceWidth = document.documentElement.clientWidth
const stackTokens = { childrenGap: deviceWidth * 0.1 }
const stackStyles = { root: { width: deviceWidth * 0.8 } }
const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.07 },
  styles: { root: { width: deviceWidth * 0.7 } },
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
          label="Mobile No."
          mask="+\91 9999999999"
        />
        {/* <Checkbox
          label="Same State (Raj.)"
          // onChange={_onChange}
        /> */}
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
