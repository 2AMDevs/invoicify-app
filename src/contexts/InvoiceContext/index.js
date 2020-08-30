import React, { useState, useContext, createContext } from 'react'

const InvoiceStateContext = createContext()
const InvoiceUpdateContext = createContext()

const InvoiceStateProvider = ({ children }) => {
  const [invoiceState, setInvoiceState] = useState({})

  const updateInvoice = (newInvoiceState) => {
    setInvoiceState(newInvoiceState)
  }

  return (
    <InvoiceStateContext.Provider value={invoiceState}>
      <InvoiceUpdateContext.Provider value={updateInvoice}>
        {children}
      </InvoiceUpdateContext.Provider>
    </InvoiceStateContext.Provider>
  )
}

const useInvoiceContext = () => [useContext(InvoiceStateContext), useContext(InvoiceUpdateContext)]

export {
  InvoiceStateContext, InvoiceStateProvider, useInvoiceContext,
}
