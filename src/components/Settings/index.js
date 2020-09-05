import React, { useState, useEffect } from 'react'

import { DefaultButton } from 'office-ui-fabric-react'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

import {
  FILE_TYPE, SELECT_FILE_TYPE, ERROR, COMPANY_NAME,
} from '../../utils/constants'
import { getFromStorage, resetSettings, isValidPath } from '../../utils/helper'
import SetPassword from '../SetPasswordModal'

import './index.scss'

// eslint-disable-next-line global-require
const { ipcRenderer } = require('electron')

const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: '40rem' } }

const Settings = ({ refreshCompanyName }) => {
  const [checkingPath, setCheckingPath] = useState(false)
  const [hideDialog, setHideDialog] = useState(true)
  const [previewBill, setPreviewBill] = useState(getFromStorage('previewPDFUrl'))
  const [previewBillErr, setPreviewBillErr] = useState('')
  const [productType, setProductType] = useState(getFromStorage('productType'))
  const [invoiceNumber, setInvoiceNumber] = useState(getFromStorage('invoiceNumber'))
  const [companyName, setCompanyName] = useState(getFromStorage('companyName'))
  const [hindiDate, setHindiDate] = useState(getFromStorage('hindiDate'))
  const [showFullMonth, setShowFullMonth] = useState(getFromStorage('showFullMonth'))
  const [font, setFont] = useState(getFromStorage('customFont'))
  const [gstinPrefix, setGstinPrefix] = useState(getFromStorage('nativeGstinPrefix'))
  const [currency, setCurrency] = useState(getFromStorage('currency'))
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      setCheckingPath(true)
      if (previewBill) setPreviewBillErr(await isValidPath(previewBill) ? '' : ERROR.FILE_MOVED)
      setCheckingPath(false)
    }())
  }, [previewBill])

  const onDateLangChange = (_, checked) => {
    localStorage.hindiDate = checked
    setHindiDate(checked)
  }

  const onMonthShowChange = (_, checked) => {
    localStorage.showFullMonth = checked
    setShowFullMonth(checked)
  }

  const onCurrencyChange = (_, val) => {
    localStorage.currency = val
    setCurrency(val)
  }

  const onGstinPrefixChange = (_, val) => {
    if (val.length > 2) return
    localStorage.nativeGstinPrefix = val
    setGstinPrefix(val)
  }

  const onNameChange = (_, newValue) => {
    localStorage.companyName = newValue
    setCompanyName(newValue)
    if (refreshCompanyName) refreshCompanyName()
  }

  const onInvoiceNoChange = (_, newValue) => {
    localStorage.invoiceNumber = newValue
    setInvoiceNumber(newValue)
  }

  const fileSelected = async (type) => {
    const filters = type === FILE_TYPE.PDF ? SELECT_FILE_TYPE.PDF : SELECT_FILE_TYPE.FONT
    const path = await ipcRenderer.invoke('select-file', filters)
    if (path) {
      if (type === FILE_TYPE.PDF) {
        setPreviewBill(path)
      } else if (type === FILE_TYPE.FONT) {
        setFont(path)
      }
      localStorage.setItem(type, path)
    }
  }

  const resetAndUpdate = () => {
    resetSettings()
    setPreviewBill(getFromStorage('previewPDFUrl'))
    setProductType(getFromStorage('productType'))
    setInvoiceNumber(getFromStorage('invoiceNumber'))
    setCompanyName(getFromStorage('companyName'))
    setHindiDate(getFromStorage('hindiDate'))
    setFont(getFromStorage('customFont'))
  }

  const onProductTypeChange = (_, newValue) => {
    localStorage.productType = newValue
    setProductType(newValue)
  }

  if (checkingPath) {
    return (
      <div className="settings-loader animation-slide-up">
        <Spinner
          size={SpinnerSize.large}
          styles={{ verticalAlign: 'center' }}
        />
      </div>
    )
  }
  return (
    <div className="settings animation-slide-up">
      <Stack
        className="invoice-page"
        tokens={stackTokens}
        styles={stackStyles}
      >
        <TextField
          label="Company Name"
          onChange={onNameChange}
          value={companyName}
        />
        <TextField
          label="Product Types"
          onChange={onProductTypeChange}
          value={productType}
          description="Comma Separated values"
        />
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            label="Next Invoice Number"
            onChange={onInvoiceNoChange}
            value={invoiceNumber}
            description="You can change next invoice number here"
          />
          <TextField
            label="Default Currency Symbol"
            onChange={onCurrencyChange}
            value={currency}
            description="Currency Symbol will be used in printing"
          />
        </Stack>
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            label="Native GSTIN Prefix"
            onChange={onGstinPrefixChange}
            value={gstinPrefix}
            description="2 Digit State Code for GSTIN"
          />
          <Toggle
            label="Date Language"
            checked={hindiDate}
            onText="हिन्दी"
            offText="English"
            onChange={onDateLangChange}
          />
          <Toggle
            label="Full Month"
            checked={showFullMonth}
            onChange={onMonthShowChange}
          />
        </Stack>
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            className="invoice-page__path-input"
            placeholder="Bill File Path (Default is no file)"
            disabled
            description="Bill Background to be show in Preview"
            value={previewBill}
            errorMessage={previewBillErr}
          />
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Bill"
            iconProps={{ iconName: 'PDF' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.PDF)}
          />
        </Stack>
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            className="invoice-page__path-input"
            placeholder="Font Path"
            disabled
            description="Select Indic Font TTF File, this will fallback to default if invalid path is found."
            value={font}
          />
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Font"
            iconProps={{ iconName: 'Font' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.FONT)}
          />
        </Stack>
        <DefaultButton
          text={`${getFromStorage('password').length ? 'Change' : 'Set'} Password`}
          iconProps={{ iconName: 'Permissions' }}
          primary
          onClick={() => setHideDialog(false)}
          styles={{ root: { width: '18rem' } }}
        />
        <DefaultButton
          text="Reset Settings"
          id="targetButton"
          iconProps={{ iconName: 'FullHistory' }}
          primary
          onClick={() => setShowAuthModal(true)}
          styles={{ root: { width: '18rem' } }}
        />
        <br />
        <p className="outside-link">
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          <b>{COMPANY_NAME}</b>
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="outside-link"
          href="https://github.com/2AMDevs"
        >
          Privacy Policy
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="outside-link"
          href="https://github.com/2AMDevs"
        >
          About
        </a>
        {!hideDialog && (
          <SetPassword
            hideDialog={hideDialog}
            setHideDialog={setHideDialog}
          />
        )}
      </Stack>
      {showAuthModal && (
        <TeachingBubble
          target="#targetButton"
          primaryButtonProps={{
            text: 'Reset',
            disabled: !authenticated,
            onClick: () => {
              resetAndUpdate()
              setAuthenticated(false)
            },
          }}
          secondaryButtonProps={{
            text: 'Cancel',
            onClick: () => {
              setShowAuthModal(false)
              setAuthenticated(false)
            },
          }}
          onDismiss={() => {
            setShowAuthModal(false)
            setAuthenticated(false)
          }}
          headline="Authenticate yourself to reset 🔐"
        >
          Lorem ipsum dolor sit amet
        </TeachingBubble>
      )}
    </div>
  )
}

export default Settings
