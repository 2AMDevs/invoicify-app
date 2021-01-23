import React, { useState } from 'react'

import { useId } from '@uifabric/react-hooks'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { createUser, verifyOtp } from '../../services/apiService'
import { getFromStorage } from '../../services/dbService'
import { validateEmail } from '../../utils/utils'

import './index.scss'

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: `${getFromStorage('password')?.length ? 'Change' : 'Set'} Password`,
  closeButtonAriaLabel: 'Close',
}

const SetPassword = ({ hideDialog, setHideDialog, isForgotPasswordPage }) => {
  const labelId = useId('changePassword')
  /** State */
  const [newPassword, setnewPassword] = useState('')
  const [email, setEmail] = useState(localStorage.email)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      isBlocking: true,
      className: 'set-password-modal',
    }),
    [labelId],
  )

  const changePassword = () => {
    localStorage.password = newPassword
    setHideDialog(true)
  }

  const emailVerificationError = (error) => {
    setIsEmailVerified(false)
    setEmailError(error ? error.message : 'Something went wrong')
  }

  const submitEmail = () => {
    if (!email) return

    const name = getFromStorage('companyName')
    createUser(name, email).then((res) => {
      if (res.status === 'OK') {
        localStorage.email = res.data.email
        setSessionId(res.data.sessionId)
        setOtpSent(true)
        setOtpError('')
      } else {
        emailVerificationError(res.error)
      }
    }).catch((e) => {
      emailVerificationError(e)
    })
  }

  const submitOtp = () => {
    if (!email || !sessionId || !otp) return

    verifyOtp(email, otp, sessionId).then((res) => {
      if (res.status === 'OK') {
        setIsEmailVerified(true)
        setOtpSent(false)
        setOtpError('')
      } else {
        setOtpError(res.error.message)
      }
    }).catch(() => setOtpError('An error occurred while verifying the otp'))
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={() => setHideDialog(true)}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <div className="set-password-modal__email-row">
        <TextField
          className="set-password-modal__email-row__input"
          label="E-mail"
          type="email"
          value={email}
          disabled={isForgotPasswordPage}
          errorMessage={emailError}
          onChange={(_e, val) => {
            setEmail(val)
            setEmailError('')
            setOtpSent(false)
            setOtp('')
            setIsEmailVerified(false)
          }}
        />
        <DefaultButton
          className="set-password-modal__email-row__submit-btn"
          text={isForgotPasswordPage ? 'Send OTP' : 'Verify Email'}
          primary
          disabled={!validateEmail(email) || otpSent}
          onClick={submitEmail}
        />
      </div>
      <div className="set-password-modal__email-row">
        <TextField
          className="set-password-modal__email-row__input"
          label="One Time Password"
          type="number"
          placeholder={otpSent ? 'Enter OTP from Email' : ''}
          value={otp}
          disabled={!otpSent}
          errorMessage={otpError}
          onChange={(_e, val) => {
            setOtp(val)
            setOtpError('')
          }}
        />
        <DefaultButton
          className="set-password-modal__email-row__submit-btn"
          text="Verify OTP"
          primary
          disabled={otp.length !== 4 || isEmailVerified}
          onClick={submitOtp}
        />
      </div>
      <TextField
        label="New Password"
        type="password"
        canRevealPassword
        value={newPassword}
        disabled={!isEmailVerified}
        onChange={(_e, val) => setnewPassword(val)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            changePassword()
          }
        }}
      />
      <DialogFooter>
        <PrimaryButton
          disabled={!isEmailVerified}
          onClick={() => changePassword()}
          text="Change Password"
        />
        <DefaultButton
          onClick={() => setHideDialog(true)}
          text="Cancel"
        />
      </DialogFooter>
    </Dialog>
  )
}

export default SetPassword
