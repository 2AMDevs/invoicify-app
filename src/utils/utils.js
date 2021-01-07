/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/**
 * @param {string} value Suspect boolean string
 * @return boolean value if string is correct or the string itself
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

/** @return Generates an UUID (hash🍀) */
const makeHash = () => ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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
 * @return Decimal Value of Number type or 0
 */
const quantize = (val) => (isNaN(parseFloat(val))
  ? 0 : +val)

/**
 * @borrows https://stackoverflow.com/a/51271494/7326407
 * @param {string} str String to be incremented. Eg: MKY42
 * @return String with incremented value (Eg: MKY43)
 * @description works with these types of formats
 * TEST01A06
 * TEST-100-A100
 * TEST0001B-101
 * TEST001A100
 * TEST001A91
 * TEST1101
 * TEST1010
 * 1010
 */
const incrementor = (str) => {
  const numPart = str.match(/(0?[1-9])+$|0?([1-9]+?0+)$/)[0]
  const strPart = str.slice(0, str.indexOf(numPart))
  const isLastIndexNine = numPart.match(/9$/)

  // If we have a leading zero (e.g. - 'L100A099')
  // or there is no prefix - we should just increment the number
  if (isLastIndexNine || strPart != null) {
    return strPart + numPart.replace(/\d+$/, (n) => ++n)
  }
  // Increment the number and add the missing zero
  return `${strPart}0${numPart.replace(/\d+$/, (n) => ++n)}`
}

export {
  getBoolFromString, makeHash, groupBy,
  titleCase, quantize, incrementor,
}
