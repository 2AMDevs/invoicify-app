/* eslint-disable no-restricted-globals */
/**
 * @param {string} value Suspect boolean string
 * @returns boolean value if string is correct
 * or the string itself
 */
const getBoolFromString = (value) => {
  switch (value) {
  case 'true':
    return true
  case 'false':
    return false
  default:
    return value
  }
}

/**
 * @returns Generates an UUID of format below
 */
const generateUuid4 = () => ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  // eslint-disable-next-line no-bitwise
  const r = Math.random() * 16 | 0
  // eslint-disable-next-line no-mixed-operators, no-bitwise
  const v = c === 'x' ? r : (r & 0x3 | 0x8)
  return v.toString(16)
}))

const groupBy = (array, key) => array.reduce((result, currentValue) => {
  // eslint-disable-next-line no-param-reassign
  (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue)
  return result
}, {})

/**
 * @param {string} string String to be transformed
 * @returns Title Cased String
 */
const titleCase = (string) => string.replace(/([A-Z])/g, ' $1')
  .replace(/^./, (str) => str.toUpperCase())

/**
 * @param {string} string Suspect Decimal Value
 * @returns Decimal Value of Number type or 0
 */
const quantize = (val) => (isNaN(parseFloat(val))
  ? 0 : +val)

export {
  getBoolFromString, generateUuid4, groupBy, titleCase, quantize,
}
