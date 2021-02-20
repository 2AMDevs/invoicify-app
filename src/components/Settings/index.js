import React, { useState, useEffect } from 'react'

import { useId } from '@uifabric/react-hooks'
import { DefaultButton, IconButton } from 'office-ui-fabric-react'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'

import { getFromStorage } from '../../services/dbService'
import { isValidPath } from '../../services/nodeService'
import { resetSettings } from '../../services/settingsService'
import {
  FILE_TYPE, SELECT_FILE_TYPE, ERROR, COMPANY_NAME,
} from '../../utils/constants'
import SetPassword from '../SetPasswordModal'

import './index.scss'

// eslint-disable-next-line global-require
const { ipcRenderer } = require('electron')

const stackTokens = { childrenGap: 15 }
const stackStyles = { root: { width: '40rem' } }

const Settings = ({ refreshCompanyName, reloadPage }) => {
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
  const [bg, setBg] = useState(getFromStorage('customLockBg'))
  const [gstinPrefix, setGstinPrefix] = useState(getFromStorage('nativeGstinPrefix'))
  const [currency, setCurrency] = useState(getFromStorage('currency'))
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [resetSettingsPasswordError, setResetSettingsPasswordError] = useState('')
  const [resetSettingsPassword, setResetSettingsPassword] = useState('')
  const [printBoth, setPrintBoth] = useState(getFromStorage('printBoth'))

  const billTooltipId = useId('billTooltipId')
  const fontTooltipId = useId('fontTooltipId')
  const bgTooltipId = useId('bgTooltipId')

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

  const onChangePrintBoth = (_, c) => {
    localStorage.printBoth = c
    setPrintBoth(c)
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
    let filters = SELECT_FILE_TYPE.PDF
    if (type === FILE_TYPE.FONT) filters = SELECT_FILE_TYPE.FONT
    if (type === FILE_TYPE.IMG) filters = SELECT_FILE_TYPE.IMG

    const path = await ipcRenderer.invoke('select-file', filters, true)
    if (path) {
      if (type === FILE_TYPE.PDF) {
        setPreviewBill(path)
      } else if (type === FILE_TYPE.FONT) {
        setFont(path)
      } else if (type === FILE_TYPE.IMG) {
        setBg(path)
      }
      localStorage.setItem(type, path)
    }
  }

  const resetLocalStorageItem = (key) => {
    if (key === FILE_TYPE.PDF) {
      setPreviewBill('')
    } else if (key === FILE_TYPE.FONT) {
      setFont('')
    } else if (key === FILE_TYPE.IMG) {
      setBg('')
    }

    localStorage.setItem(key, '')
  }

  const resetAndUpdate = () => {
    resetSettings()
  }

  const verifyAndReset = () => {
    if (resetSettingsPassword === getFromStorage('password')) {
      resetAndUpdate()
      setResetSettingsPasswordError(null)
      setShowAuthModal(false)
      reloadPage()
    } else {
      setResetSettingsPasswordError('Incorrect Password')
    }
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
            label="Next Invoice"
            onChange={onInvoiceNoChange}
            value={invoiceNumber}
            description="You can change next invoice number here"
          />
          <TextField
            label="Currency Symbol"
            onChange={onCurrencyChange}
            value={currency}
            description="Currency Symbol will be used in printing"
          />
          <Toggle
            label="Print Both Types"
            checked={printBoth}
            onChange={onChangePrintBoth}
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
          {previewBill && (
            <TooltipHost
              content="Clear Bill Path"
              id={billTooltipId}
            >
              <IconButton
                iconProps={{ iconName: 'Emoji2' }}
                title="Clear Bill Path"
                ariaLabel="Clear Bill Path"
                onClick={() => resetLocalStorageItem(FILE_TYPE.PDF)}
              />
            </TooltipHost>
          )}
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
          {font && (
            <TooltipHost
              content="Clear Font Path"
              id={fontTooltipId}
            >
              <IconButton
                iconProps={{ iconName: 'Emoji2' }}
                title="Clear Font Path"
                ariaLabel="Clear Font Path"
                onClick={() => resetLocalStorageItem(FILE_TYPE.FONT)}
              />
            </TooltipHost>
          )}
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Font"
            iconProps={{ iconName: 'Font' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.FONT)}
          />
        </Stack>
        <Stack
          tokens={stackTokens}
          horizontal
        >
          <TextField
            className="invoice-page__path-input"
            placeholder="Lock Screen Background"
            disabled
            description="Select Image to be shown in lock screen background"
            value={bg}
          />
          {bg && (
            <TooltipHost
              content="Clear Background"
              id={bgTooltipId}
            >
              <IconButton
                iconProps={{ iconName: 'Emoji2' }}
                title="Clear Background"
                ariaLabel="Clear Background"
                onClick={() => resetLocalStorageItem(FILE_TYPE.IMG)}
              />
            </TooltipHost>
          )}
          <DefaultButton
            className="invoice-page__select-btn"
            text="Select Img"
            iconProps={{ iconName: 'Picture' }}
            primary
            onClick={() => fileSelected(FILE_TYPE.IMG)}
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
            onClick: () => {
              verifyAndReset()
            },
          }}
          secondaryButtonProps={{
            text: 'Cancel',
            onClick: () => {
              setResetSettingsPasswordError('')
              setShowAuthModal(false)
            },
          }}
          onDismiss={() => {
            setResetSettingsPasswordError('')
            setShowAuthModal(false)
          }}
          headline="Authenticate yourself to reset 🔐"
        >
          <TextField
            placeholder="Enter password"
            type="password"
            onChange={(_, val) => setResetSettingsPassword(val)}
            errorMessage={resetSettingsPasswordError}
          />
        </TeachingBubble>
      )}
    </div>
  )
}

export default Settings
