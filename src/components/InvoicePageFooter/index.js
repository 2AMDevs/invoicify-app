import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react'

import './index.scss'

const InvoicePageFooter = ({
  printAndMove, printWithBill, previewPDF, resetForm,
}) => (
  <div className="invoice-page-footer">
    <DefaultButton
      text="Print Invoice"
      title="ctrl + p"
      iconProps={{ iconName: 'print' }}
      primary
      onClick={printAndMove}
    />
    <DefaultButton
      text="Print Invoice With Bill Background"
      title="ctrl + shft + p"
      iconProps={{ iconName: 'PrintfaxPrinterFile' }}
      primary
      onClick={printWithBill}
    />
    <DefaultButton
      text="Preview Invoice"
      title="ctrl + s"
      iconProps={{ iconName: 'LightningBolt' }}
      primary
      onClick={previewPDF}
    />
    <DefaultButton
      text="Reset"
      iconProps={{ iconName: 'refresh' }}
      onClick={resetForm}
    />
  </div>
)

export default InvoicePageFooter
