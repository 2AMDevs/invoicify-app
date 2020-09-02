import React, { useState, useEffect } from 'react'

import { FontIcon } from 'office-ui-fabric-react/lib/Icon'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { useAuthContext } from '../../contexts'
import { getFromStorage } from '../../utils/helper'

import './index.scss'

const LockScreen = () => {
  const [authState, updateAuthState] = useAuthContext()
  const [time, setTime] = useState(new Date())
  const [userInput, setUserInput] = useState('')
  const [errorMessage, setError] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
      className="lock-screen animation-slide-down"
    >
      <div className="lock-screen__hero-icn animation-scale-down">
        <FontIcon
          className="pretty-huge lock-screen__items__lock-icn"
          iconName="Lock"
        />
      </div>
      <div className="lock-screen__items animation-slide-up">
        {/* <p className="not-so-huge">{time.toDateString()}</p>
        <p className="huge">{time.toLocaleTimeString()}</p> */}
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
          type="password"
          value={userInput}
          onChange={(_, val) => {
            setUserInput(val)
            if (!val.length) setError('')
          }}
          onKeyPress={unlock}
          errorMessage={errorMessage}
        />
      </div>
      <div className="lock-screen__clock animation-slide-up">
        <span className="row-flex">
          <FontIcon
            className="lock-screen__clock__icn"
            iconName="DateTime"
          />
          <p className="not-so-huge">{time.toDateString()}</p>
        </span>
        <span className="row-flex">
          <p className="huge">{time.toLocaleTimeString()}</p>
        </span>
      </div>
    </div>
  )
}

export default LockScreen
