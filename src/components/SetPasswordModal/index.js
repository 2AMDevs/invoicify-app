import React, { useState } from 'react'

import { useId } from '@uifabric/react-hooks'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { getFromStorage } from '../../services/dbService'
import { createUser } from '../../services/apiService'

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: `${getFromStorage('password')?.length ? 'Change' : 'Set'} Password`,
  closeButtonAriaLabel: 'Close',
}

const SetPassword = ({ hideDialog, setHideDialog }) => {
  const labelId = useId('changePassword')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setnewPassword] = useState('')
  createUser()

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      isBlocking: true,
    }),
    [labelId],
  )

  const changePassword = () => {
    localStorage.password = newPassword
    setHideDialog(true)
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={() => setHideDialog(true)}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
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
