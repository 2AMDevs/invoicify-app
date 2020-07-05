const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    return parseInt(value, 10)
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

const everyThingAgain = 42

export { getFromStorage, everyThingAgain }
