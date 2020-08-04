import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { PAY_METHOD } from '../../utils/constants'
import { titleCase } from '../../utils/helper'

const HoverTotal = ({ hoverCard, invoiceFooter, updateInvoiceFooter }) => {
  const dismissCard = () => {
    if (hoverCard.current) hoverCard.current.dismiss()
  }
  return (
    <div className="hoverCard">
      {Object.values(PAY_METHOD).map((key, idx) => (
        <TextField
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          label={titleCase(key)}
          type="number"
          disabled={key === PAY_METHOD.CASH}
          value={key === PAY_METHOD.CASH
            ? parseFloat(invoiceFooter[key]).toFixed(2) : invoiceFooter[key]}
          prefix="₹"
          onChange={(_, val) => updateInvoiceFooter({ [key]: val })}
        />
      ))}
      <DefaultButton
        onClick={dismissCard}
        text="Done"
      />
    </div>
  )
}

export default HoverTotal
