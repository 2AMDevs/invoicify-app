import * as React from 'react'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { Stack } from 'office-ui-fabric-react/lib/Stack'

const stackTokens = { childrenGap: 10 }

// eslint-disable-next-line no-underscore-dangle
const _onChange = () => {
  // eslint-disable-next-line no-console
  console.log('Hi')
}

const Settings = () => (
  <Stack
    className="invoice-page"
    tokens={stackTokens}
  >
    <Toggle
      label="Toggle Theme"
      defaultChecked
      onText="On"
      offText="Off"
      onChange={_onChange}
    />

    <Toggle
      label=""
      onText="On"
      offText="Off"
      onChange={_onChange}
    />

    <Toggle
      label="Disabled and checked"
      defaultChecked
      disabled
      onText="On"
      offText="Off"
    />

    <Toggle
      label="Disabled and unchecked"
      disabled
      onText="On"
      offText="Off"
    />

    <Toggle
      label="With inline label"
      inlineLabel
      onText="On"
      offText="Off"
      onChange={_onChange}
    />

    <Toggle
      label="Disabled with inline label"
      inlineLabel
      disabled
      onText="On"
      offText="Off"
    />

    <Toggle
      label="With inline label and without onText and offText"
      inlineLabel
      onChange={_onChange}
    />

    <Toggle
      label="Disabled with inline label and without onText and offText"
      inlineLabel
      disabled
    />

    <Toggle
      label="Enabled and checked (ARIA 1.0 compatible)"
      defaultChecked
      onText="On"
      offText="Off"
      onChange={_onChange}
      role="checkbox"
    />
  </Stack>
)

export default Settings
