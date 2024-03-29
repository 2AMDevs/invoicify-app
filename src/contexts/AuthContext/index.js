import React, { useState, useContext, createContext } from 'react'

const AuthStateContext = createContext()
const AuthUpdateContext = createContext()

const AuthStateProvider = ({ children }) => {
  // add more fields to the authState object if you need
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
  })

  const updateAuth = (newAuthState) => {
    // if using current state structure
    // newAuthState = { isAuthenticated: true }
    setAuthState(newAuthState)
  }

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthUpdateContext.Provider value={updateAuth}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthStateContext.Provider>
  )
}

const useAuthContext = () => [useContext(AuthStateContext), useContext(AuthUpdateContext)]

export {
  AuthStateContext, AuthStateProvider, useAuthContext,
}
