/* eslint-disable no-restricted-globals */
import { getBoolFromString } from '../utils/utils'
import { getPrintersList } from './nodeService'

/**
 * @param {string} key Name of DB key to access
 * @param {string} type Type of DB attribute (num | json).
 * String and bool-strings handled automatically
 * @returns returnValue
 */
const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    return isNaN(intVal) ? 1 : intVal
  }
  if (type === 'json') {
    return JSON.parse(value)
  }

  return getBoolFromString(value)
}

const getProductTypes = () => getFromStorage('productType')?.split(',')?.map((type) => ({
  key: type.trim(),
  text: type.trim(),
})) || []

const currency = (val, format) => {
  const parsedCurrency = isNaN(parseFloat(val))
    ? 0 : Math.round(parseFloat(val) * 100) / 100

  return format ? `${getFromStorage('currency') || ''} ${new Intl.NumberFormat('en-IN', {
    currency: 'INR',
  }).format(parsedCurrency)}` : parsedCurrency
}

const setProduct = (product) => {
  let editing = false
  const products = (getFromStorage('products', 'json') || []).map((p) => {
    if (p.id === product.id) {
      editing = true
      return product
    }
    return p
  })

  if (!editing) products.push(product)

  localStorage.setItem('products', JSON.stringify(products))
}

const setProducts = (newProducts, replace) => {
  const products = (getFromStorage('products', 'json') || [])
  localStorage.setItem('products',
    JSON.stringify(replace
      ? newProducts
      : [...products, ...newProducts]))
}

const deleteProducts = (ids) => {
  const products = (getFromStorage('products', 'json') || [])
    .filter((p) => !ids.includes(p.id))
  localStorage.setItem('products', JSON.stringify(products))
}

const getProducts = (id) => {
  const products = getFromStorage('products', 'json') || []
  if (!id) {
    return products
  }
  const [product] = products.filter((p) => p.id === id)
  return product
}

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

const updatePrinterList = async () => {
  localStorage.printers = JSON.stringify(await printerList())
}

export {
  getFromStorage, getProductTypes, currency,
  setProducts, setProduct, deleteProducts, getProducts, updatePrinterList,
}
