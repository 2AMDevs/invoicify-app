import React, { useState } from 'react'

import { useId } from '@uifabric/react-hooks'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { createUser } from '../../services/apiService'
import { getFromStorage } from '../../services/dbService'

import './index.scss'

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: `${getFromStorage('password')?.length ? 'Change' : 'Set'} Password`,
  closeButtonAriaLabel: 'Close',
}

const SetPassword = ({ hideDialog, setHideDialog }) => {
  const labelId = useId('changePassword')
  /** State */
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [email, setEmail] = useState('')

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

  const submitEmail = (email) => {
    const name = getFromStorage('companyName')
    createUser(name, email).then((res) => {
      console.log(res)
      // localStorage.email = email
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={() => setHideDialog(true)}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <div className="set-password-modal__fields">
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(_e, val) => setEmail(val)}
        />
        {getFromStorage('password').length ? (
          <TextField
            label="Old Password"
            iconProps={{ iconName: 'Hide3' }}
            type="password"
            value={oldPassword}
            onChange={(_e, val) => setOldPassword(val)}
          />
        ) : ''}
        <TextField
          label="New Password"
          iconProps={{ iconName: 'Hide3' }}
          type="password"
          value={newPassword}
          disabled={oldPassword !== getFromStorage('password')}
          onChange={(_e, val) => setnewPassword(val)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              changePassword()
            }
          }}
        />
      </div>
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
