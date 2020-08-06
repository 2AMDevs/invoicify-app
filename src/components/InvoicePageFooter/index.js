import React, { useState } from 'react'

import { DefaultButton } from 'office-ui-fabric-react'

import { getFromStorage, updatePrinterList } from '../../utils/helper'
import './index.scss'

const InvoicePageFooter = ({
  printAndMove, printWithBill, previewPDF, resetForm,
}) => {
  const [printer, setPrinter] = useState(localStorage.printer)
  const [updating, setUpdating] = useState(false)
  const setDefaultPrinter = (key) => {
    setPrinter(key)
    localStorage.printer = key
  }

  const updateOptions = async () => {
    setUpdating(!updating)
    await updatePrinterList()
    setUpdating(!updating)
  }

  const menuProps = {
    items: getFromStorage('printers') && JSON.parse(getFromStorage('printers')).map((e) => ({
      ...e,
      onClick: () => setDefaultPrinter(e.key),
      isChecked: printer === e.key,
    })),
  }

  return (
    <div className="invoice-page-footer">
      <div>
        <DefaultButton
          primary
          className="invoice-page-footer__button_left"
          text={`Print Invoice ${printer ? `(${printer})` : ''}`}
          primaryDisabled={!printer}
          split
          title="Ctrl + P"
          iconProps={{ iconName: 'print' }}
          splitButtonAriaLabel="Select Printer"
          menuProps={menuProps}
          onClick={printAndMove}
        />
        <DefaultButton
          className="invoice-page-footer__button_left"
          text="Print With Bill BG"
          title="Ctrl + Shft + P"
          iconProps={{ iconName: 'PrintfaxPrinterFile' }}
          primary
          primaryDisabled={!printer}
          onClick={printWithBill}
        />
        <DefaultButton
          className="invoice-page-footer__button_left"
          text="Preview Invoice"
          title="Ctrl + S"
          iconProps={{ iconName: 'LightningBolt' }}
          primary
          onClick={previewPDF}
        />
        <DefaultButton
          className="invoice-page-footer__button_left"
          text="Reset"
          iconProps={{ iconName: 'refresh' }}
          onClick={resetForm}
        />
      </div>
      <DefaultButton
        className="invoice-page-footer__button_right"
        text="Refresh Printers"
        iconProps={{ iconName: 'Refresh' }}
        primary
        onClick={updateOptions}
      />
    </div>
  )
}

export default InvoicePageFooter
