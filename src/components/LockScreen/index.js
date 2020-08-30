import './index.scss'
import React, { useState } from 'react'

import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { useAuthContext } from '../../contexts'
import { getFromStorage } from '../../utils/helper'

const LockScreen = () => {
  const [authState, updateAuthState] = useAuthContext()
  const [time, setTime] = useState(new Date())
  const [userInput, setUserInput] = useState('')
  const [errorMessage, setError] = useState('')

  const unlock = (event) => {
    if (event.key === 'Enter') {
      if (userInput === getFromStorage('password')) updateAuthState({ isAuthenticated: !authState.isAuthenticated })
      else {
        setError('Incorrect password entered!')
      }
    }
  }

  return (
    <div
      className="lock-screen"
    >
      <Stack>
        <p className="huge">{time.toDateString()}</p>
        {/* <p className="huge">{time.toLocaleTimeString()}</p> */}
        <br />
        <p className="okayish">
          Hey!
          <span
            role="img"
            aria-label="wave-hand"
          >
            👋🏻
          </span>
          {' '}
          {getFromStorage('companyName')}
        </p>
        <br />
        <TextField
          label="Enter Password (if not set simply press enter)"
          iconProps={{ iconName: 'Hide3' }}
          type="password"
          value={userInput}
          onChange={(_e, val) => {
            setUserInput(val)
            if (!val.length) setError('')
          }}
          onKeyPress={unlock}
          errorMessage={errorMessage}
        />
      </Stack>

    </div>
  )
}

export default LockScreen
