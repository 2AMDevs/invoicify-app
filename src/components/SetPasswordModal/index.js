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

const SetPassword = ({ hideDialog, setHideDialog }) => {
  const labelId = useId('changePassword')
  /** State */
  const [newPassword, setnewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
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
      console.log(res)
      if (res.status === 'OK') {
        setIsEmailVerified(true)
      } else {
        // emailVerificationError(res.error)
      }
    }).catch((e) => {
      console.log(e)
      // emailVerificationError(e)
    })
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
          errorMessage={emailError}
          onChange={(_e, val) => {
            setEmail(val)
            setEmailError('')
          }}
        />
        <DefaultButton
          className="set-password-modal__email-row__submit-btn"
          text="Verify email"
          primary
          disabled={!validateEmail(email)}
          onClick={submitEmail}
        />
      </div>
      <TextField
        label="New Password"
        iconProps={{ iconName: 'Hide3' }}
        type="password"
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
