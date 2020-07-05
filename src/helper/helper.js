const getFromStorage = (key) => {
  const value = localStorage[key]
  switch (value) {
  case 'true':
    return true
  case 'false':
    return false
  default:
    return value
  }
}

const everyThingAgain = 42

export { getFromStorage, everyThingAgain }
