const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    // eslint-disable-next-line no-restricted-globals
    return isNaN(intVal) ? 1 : intVal
  }
  switch (value) {
  case 'true':
    return true
  case 'false':
    return false
  default:
    return value
  }
}

const initializeSettings = () => {
  localStorage.companyName = localStorage.companyName ?? 'Tesla Parchuni'
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.settingsOne = localStorage.settingsOne ?? true
  localStorage.checkForUpdates = localStorage.checkForUpdates ?? true
}

export { getFromStorage, initializeSettings }
