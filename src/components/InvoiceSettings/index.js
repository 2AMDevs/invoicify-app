import React from 'react'

import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

const deviceWidth = document.documentElement.clientWidth

const InvoiceSettings = () => (
  <Stack
    horizontal
    {...{
      tokens: { childrenGap: deviceWidth * 0.02 },
      styles: { root: { width: deviceWidth * 0.4 } },
    }}
  >
    <TextField
      label="Field Name"
      // onChange={onNameChange}
      // value={companyName}
    />
    <TextField
      label="X Co-ordinate"
      // onChange={onInvoiceNoChange}
      // value={invoiceNumber}
    />
    <TextField
      label="Y Co-ordinate"
      // onChange={onBillURLChange}
      // value={previewBill}
    />
    <TextField
      label="Font Size"
      // onChange={onBillURLChange}
      // value={previewBill}
    />
  </Stack>
)

export default InvoiceSettings
