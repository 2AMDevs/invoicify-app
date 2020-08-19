import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react'

import { getFromStorage, updatePrinterList } from '../../utils/helper'
import './index.scss'

class InvoicePageFooter extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      printer: localStorage.printer,
      updating: false,
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keyDownHandler, true)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyDownHandler, true)
  }

  setPrinter = (printer) => this.setState({ printer })

  setUpdating = (updating) => this.setState({ updating })

  setDefaultPrinter = (key) => {
    this.setPrinter(key)
    localStorage.printer = key
  }

  keyDownHandler = (e) => {
    if (e.shiftKey && e.ctrlKey) {
      const { key, repeat } = e
      if (repeat) return
      if (key.toLowerCase() === 'p' && this.props.printWithBill) this.props.printWithBill()
      return
    }

    if (e.ctrlKey) {
      const { key, repeat } = e
      if (repeat) return

      // toLowerCase here is mandatory otherwise, hotkeys won't work with capslock on. 😁
      switch (key.toLowerCase()) {
      case 's':
        this.props.previewPDF()
        break
      case 'p':
        this.props.printAndMove()
        break
      case 'r':
        this.props.resetForm()
        break
      default:
      }
    }
  }

  updateOptions = async () => {
    this.setUpdating(!this.state.updating)
    await updatePrinterList()
    this.setUpdating(!this.state.updating)
  }

  render () {
    const menuProps = {
      items: getFromStorage('printers') && JSON.parse(getFromStorage('printers')).map((e) => ({
        ...e,
        onClick: () => this.setDefaultPrinter(e.key),
        isChecked: this.state.printer === e.key,
      })),
    }

    return (
      <div className="invoice-page-footer">
        <div>
          <DefaultButton
            primary
            className="invoice-page-footer__button_left"
            text={`Print Invoice ${this.state.printer ? `(${this.state.printer})` : ''}`}
            primaryDisabled={!this.state.printer}
            split
            title="Ctrl + P"
            iconProps={{ iconName: 'print' }}
            splitButtonAriaLabel="Select Printer"
            menuProps={menuProps}
            onClick={this.props.printAndMove}
            disabled={this.props.disablePrintButton}
          />
          <DefaultButton
            className="invoice-page-footer__button_left"
            text="Print With Bill BG"
            title="Ctrl + Shft + P"
            iconProps={{ iconName: 'PrintfaxPrinterFile' }}
            primary
            primaryDisabled={!this.state.printer}
            onClick={this.props.printWithBill}
            disabled={this.props.disablePrintButton}
          />
          <DefaultButton
            className="invoice-page-footer__button_left"
            text="Preview Invoice"
            title="Ctrl + S"
            iconProps={{ iconName: 'LightningBolt' }}
            primary
            onClick={this.props.previewPDF}
          />
          <DefaultButton
            className="invoice-page-footer__button_left"
            text="Reset"
            title="Ctrl + R"
            iconProps={{ iconName: 'refresh' }}
            onClick={this.props.resetForm}
          />
        </div>
        <DefaultButton
          className="invoice-page-footer__button_right"
          text="Refresh Printers"
          iconProps={{ iconName: 'Refresh' }}
          primary
          onClick={this.props.updateOptions}
        />
      </div>
    )
  }
}

export default InvoicePageFooter
