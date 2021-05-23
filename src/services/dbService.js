/* eslint-disable no-restricted-globals */
import { getBoolFromString } from '../utils/utils'
import { getPrintersList } from './nodeService'

/**
 * @param {string} key Name of DB key to access
 * @param {string} [type] Type of DB attribute (num | json).
 * String and bool-strings handled automatically
 * @return returns the value of key from DB casted to
 * type specified
 */
const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    return isNaN(intVal) ? 1 : intVal
  }
  if (type === 'json') {
    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }

  return getBoolFromString(value)
}

/** @return Return Parsed Array of Products from DB */
const getProductsJSON = () => getFromStorage('products', 'json') || []

/**
 * @return Fetches Product Type Array String from DB
 * and converts it into usable key, text object
 */
const getProductTypes = () => getFromStorage('productType')?.split(',')?.map((type) => ({
  key: type.trim(),
  text: type.trim(),
})) || []

/**
 * @param {string} val Name of DB key to access
 * @param {boolean} [format] Flag on whether or not to format the amount.
 * @return String containing Currency Symbol as per DB
 * then number formatted as per Indian Currency standard
 */
const currency = (val, format) => {
  const parsedCurrency = isNaN(parseFloat(val))
    ? 0 : Math.round(parseFloat(val) * 100) / 100

  return format ? `${getFromStorage('currency') || ''} ${new Intl.NumberFormat('en-IN', {
    currency: 'INR',
  }).format(parsedCurrency)}` : parsedCurrency
}

/**
 * Adds/Replace Array of Products in DB
 * @param {Array} newProducts Array of Product Objects
 * @param {boolean} [replace] Flag indicating whether to replace all.
 */
const setProducts = (newProducts, replace) => {
  const products = (getProductsJSON())
  localStorage.setItem('products',
    JSON.stringify(replace
      ? newProducts
      : [...products, ...newProducts]))
}

/**
 * Alters the Product with same ID or
 * inserts a new one if doesn't exist
 * @param {object} product Product Object to be added in DB
 */
const upsertProduct = (product) => {
  const products = getProductsJSON()
  let isFound = false

  const newProducts = products.map((p) => {
    if (p.id === product.id) {
      isFound = true
      return product
    }

    return p
  })

  if (!isFound) newProducts.push(product)

  setProducts(newProducts, true)
}

/**
 * Deletes Product with id in ids array from DB
 * @param {Array} ids Array of Product IDs
 */
const deleteProducts = (ids) => {
  const products = (getProductsJSON())
    .filter((p) => !ids.includes(p.id))
  setProducts(products, true)
}

/**
 * Returns Product with id if `id` is given
 * else returns Array of all Products
 * @param {string} [id] id of Product to be fetched
 * @return Single Product with id as `id` or
 * array of Products
 */
const getProducts = (id) => {
  const products = getProductsJSON()
  if (!id) {
    return products
  }
  const [product] = products.filter((p) => p.id === id)
  return product
}

/**
 * @async
 * Fetches Printers from Client PC and modifies
 * the list so that we can use it to render options
 * @return Array of Fabric UI Friendly Objects
 * helping in rendering Printer Options
 */
const printerList = async () => {
  const list = await getPrintersList()
  const getIcon = (name) => {
    if (name.includes('Fax')) return 'fax'
    if (name.includes('to PDF')) return 'pdf'
    if (name.includes('OneNote')) return 'OneNoteLogo16'
    if (name.includes('Cloud')) return 'Cloud'
    return 'print'
  }
  return list.map((key) => ({
    key,
    text: key,
    canCheck: true,
    iconProps: { iconName: getIcon(key) },
  }))
}

/**
 * @async
 * Sets the Printers List to DB
 */
const updatePrinterList = async () => {
  localStorage.printers = JSON.stringify(await printerList())
}

/**
 * Fetch Update Details from storage
 * @return JSON Object with Update Details
 */
const getUpdateInfo = () => getFromStorage('updateInfo', 'json')

/**
 * Updates Update Object in Storage
 * @param {Object} data, Object to be updated
 * @param {string} [key], key to be updated
 * @return JSON Object with Update Details
 */
const editUpdateInfo = (data, key) => {
  let currentObj = getUpdateInfo() ?? {}
  if (key) {
    currentObj[key] = data
  } else {
    currentObj = data
  }
  localStorage.setItem('updateInfo', JSON.stringify(currentObj))
}

export {
  getFromStorage, getProductTypes, currency,
  setProducts, upsertProduct, deleteProducts, getProducts,
  updatePrinterList, getUpdateInfo, editUpdateInfo,
  getProductsJSON,
}
