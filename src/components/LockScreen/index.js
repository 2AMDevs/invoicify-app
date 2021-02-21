import React, { useEffect, useState } from 'react'

import { ActionButton } from 'office-ui-fabric-react'
import { FontIcon } from 'office-ui-fabric-react/lib/Icon'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { useAuthContext } from '../../contexts'
import { getFromStorage } from '../../services/dbService'
import { getB64File } from '../../services/nodeService'
import SetPassword from '../SetPasswordModal'

import './index.scss'

const LockScreen = () => {
  const [authState, updateAuthState] = useAuthContext()
  const [time, setTime] = useState(new Date())
  const [userInput, setUserInput] = useState('')
  const [bgImg, setBgImg] = useState('')
  const [errorMessage, setError] = useState('')
  const [hidePasswordDialog, setHidePasswordDialog] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const bgPath = getFromStorage('customLockBg')

    if (bgPath) {
      getB64File(bgPath).then((b64Img) => !bgImg && setBgImg(b64Img))
    }
  }, [bgImg])

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
      style={{ backgroundImage: `url(data:image/png;base64,${bgImg})` }}
    >
      <div className="lock-screen__hero-icn animation-scale-down">
        <FontIcon
          className="pretty-huge lock-screen__items__lock-icn"
          iconName="Lock"
        />
      </div>
      <div className="lock-screen__items animation-slide-up">
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
        <p className="human-size">{localStorage.password ? 'Enter Password' : 'Press Enter'}</p>
        <TextField
          type="password"
          autoFocus
          canRevealPassword
          value={userInput}
          onChange={(_, val) => {
            setUserInput(val)
            if (!val.length) setError('')
          }}
          onKeyPress={unlock}
          errorMessage={errorMessage}
        />
        {localStorage.password && (
          <>
            <ActionButton
              text="Forgot Password?"
              iconProps={{ iconName: 'Permissions' }}
              primary
              onClick={() => setHidePasswordDialog(false)}
              styles={{ root: { marginTop: '2rem' } }}
            />
            {!hidePasswordDialog && (
              <SetPassword
                isForgotPasswordPage
                hideDialog={hidePasswordDialog}
                setHideDialog={setHidePasswordDialog}
              />
            )}
          </>
        )}
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
