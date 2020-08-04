import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

const HoverTotal = ({ hoverCard, invoiceFooter, updateInvoiceFooter }) => {
  const dismissCard = () => {
    if (hoverCard.current) hoverCard.current.dismiss()
  }
  const {
    cheque, card, upi, totalAmount,
  } = invoiceFooter
  return (
    <div className="hoverCard">
      <TextField
        label="Cash"
        type="number"
        disabled
        value={
          (totalAmount - cheque - upi - card).toFixed(2)
        }
        prefix="₹"
      />
      <TextField
        label="Cheque"
        type="number"
        value={cheque}
        prefix="₹"
        onChange={(_, val) => updateInvoiceFooter({ cheque: val })}
      />
      <TextField
        label="Card"
        type="number"
        value={card}
        prefix="₹"
        onChange={(_, val) => updateInvoiceFooter({ card: val })}
      />
      <TextField
        label="UPI"
        type="number"
        value={upi}
        prefix="₹"
        onChange={(_, val) => updateInvoiceFooter({ upi: val })}
      />
      <DefaultButton
        onClick={dismissCard}
        text="Done"
      />
    </div>
  )
}

export default HoverTotal
