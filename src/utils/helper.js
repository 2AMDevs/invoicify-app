/* eslint-disable no-restricted-globals */
import fontkit from '@pdf-lib/fontkit'
import * as toWords from 'convert-rupees-into-words'
import { PDFDocument } from 'pdf-lib'

import {
  PREVIEW, PRINT, DATE, defaultPrintSettings,
  CUSTOM_FONT, UPDATE_RESTART_MSG, morePrintSettings,
} from './constants'

// eslint-disable-next-line global-require
const { ipcRenderer } = require('electron')

const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    return isNaN(intVal) ? 1 : intVal
  }
  if (type === 'json') {
    return JSON.parse(value)
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

const getProductTypes = () => getFromStorage('productType')?.split(',')?.map((type) => ({
  key: type.trim(),
  text: type.trim(),
})) || []

const currency = (val) => {
  const parsedCurrency = parseFloat(val)
  return isNaN(parsedCurrency) ? 0 : parsedCurrency
}

ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version')
  localStorage.setItem('version', arg.version)
})

const initializeSettings = () => {
  localStorage.companyName = localStorage.companyName ?? 'Tesla Parchuni'
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.products = localStorage.products ?? '[]'
  localStorage.productType = localStorage.productType ?? 'Gold, Silver'
  localStorage.invoiceSettings = localStorage.invoiceSettings
                                  ?? JSON.stringify(defaultPrintSettings)
  localStorage.morePrintSettings = localStorage.morePrintSettings
  ?? JSON.stringify(morePrintSettings)
  ipcRenderer.send('app_version')
}

const printPDF = (pdfBytes) => {
  ipcRenderer.send('print-it', pdfBytes)
}

const getInvoiceDate = (date) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
  }
  const hindiDate = getFromStorage('hindiDate')
  return date.toLocaleDateString(`${hindiDate ? 'hi' : 'en'}-IN`, options)
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
  localStorage.setItem('products', JSON.stringify(replace ? newProducts : [...products, ...newProducts]))
}

const deleteProducts = (ids) => {
  const products = (getFromStorage('products', 'json') || []).filter((p) => !ids.includes(p.id))
  localStorage.setItem('products', JSON.stringify(products))
}

const getProducts = (id) => {
  const productsString = localStorage.getItem('products')
  const products = productsString ? JSON.parse(productsString) : []
  if (!id) {
    return products
  }
  const [product] = products.filter((p) => p.id === id)
  return product
}

const getInvoiceSettings = (extra) => {
  const key = extra ? 'morePrintSettings' : 'invoiceSettings'
  const invoiceSettings = localStorage.getItem(key)
  return invoiceSettings ? JSON.parse(invoiceSettings) : []
}

const getPdf = async (invoiceDetails, mode = PRINT) => {
  const { meta, items, footer } = invoiceDetails
  let pdfDoc
  const previewPath = getFromStorage('previewPDFUrl')
  const isPreviewMode = (mode === PREVIEW) && previewPath
  const ourFont = await fetch(CUSTOM_FONT).then((res) => res.arrayBuffer())
  if (isPreviewMode) {
    const existingPdfBytes = await ipcRenderer.invoke('read-pdf', previewPath)
    pdfDoc = await PDFDocument.load(existingPdfBytes)
  } else {
    pdfDoc = await PDFDocument.create()
  }

  pdfDoc.registerFontkit(fontkit)
  const font = await pdfDoc.embedFont(ourFont)
  const fontSize = 11

  const page = isPreviewMode ? pdfDoc.getPages()[0] : pdfDoc.addPage()

  // Print Invoice Header
  getInvoiceSettings().forEach((field) => {
    if (meta[field.name]) {
      const value = field.type === DATE
        ? getInvoiceDate(meta[field.name])
        : meta[field.name].toString()
      page.drawText(value, {
        x: parseFloat(field.x),
        y: parseFloat(field.y),
        size: fontSize,
        font,
      })
    }
  })

  // Print Items
  const printSettings = getInvoiceSettings(true)
  items.forEach((item, idx) => {
    const commonStuff = (x, text, fromStart) => {
      const stringifiedText = text.toString()
      const newX = parseFloat(x
        - (fromStart ? 0 : font.widthOfTextAtSize(stringifiedText, fontSize)))
      return [stringifiedText,
        {
          x: newX,
          y: parseFloat(printSettings.itemStartY - idx * printSettings.diffBetweenItemsY),
          size: fontSize,
          font,
        },
      ]
    }

    const product = getProducts(item.product)
    if (product?.name) {
      page.drawText(...commonStuff(45, (idx + 1)), 1)
      page.drawText(...commonStuff(170, `${product?.name} [${product?.type}]`), 1)
      page.drawText(...commonStuff(232, item.quantity))
      page.drawText(...commonStuff(283, `${item.gWeight}gms`))
      page.drawText(...commonStuff(333, `${item.weight}gms`))
      page.drawText(...commonStuff(380, `${currency(item.price)}/-`))
      page.drawText(...commonStuff(428, `${currency(item.mkg)}%`))
      page.drawText(...commonStuff(478, `${currency(item.other)}/-`))
      page.drawText(...commonStuff(560, `${currency(item.totalPrice).toFixed(2)}/-`))
    }
  })

  // Print Footer
  const footerCommonParts = (y, key) => {
    const text = `${currency(footer[key]).toFixed(2)}/-`
    return [
      text,
      {
        x: parseFloat(printSettings.endAmountsX - font.widthOfTextAtSize(text, fontSize)),
        y,
        size: fontSize,
        font,
      },
    ]
  }
  page.drawText(...footerCommonParts(210, 'grossTotal'))
  page.drawText(...footerCommonParts(190, 'cgst'))
  page.drawText(...footerCommonParts(170, 'sgst'))
  page.drawText(...footerCommonParts(148, 'igst'))
  page.drawText(...footerCommonParts(128, 'totalAmount'))
  page.drawText(...footerCommonParts(108, 'oldPurchase'))
  page.drawText(...footerCommonParts(88, 'grandTotal'))

  page.drawText(toWords(footer.grandTotal), {
    x: 85,
    y: 87,
    size: fontSize,
    font,
  })

  pdfDoc.setTitle('Invoice Preview')
  pdfDoc.setAuthor('2AM Devs')

  // Serialize the PDFDocument to base64
  return pdfDoc.save()
}

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

ipcRenderer.on('updateDownloaded', () => {
  const notification = document.getElementById('notification')
  const message = document.getElementById('message')
  const restartButton = document.getElementById('restart-button')
  if (message) message.innerText = UPDATE_RESTART_MSG
  restartButton.classList.remove('hidden')
  notification.parentElement.parentElement.parentElement.classList.remove('hidden')
})

ipcRenderer.on('message', (_event, msg) => {
  const notification = document.getElementById('notification')
  const message = document.getElementById('message')
  if (message) message.innerText = msg
  if (notification) notification.parentElement.parentElement.parentElement.classList.remove('hidden')
})

const quitApp = () => {
  ipcRenderer.send('bye-bye')
}

const closeNotification = () => {
  const n = document.getElementById('notification')
  n.parentElement.parentElement.parentElement.classList.add('hidden')
}

const restartApp = () => {
  ipcRenderer.send('restart_app')
}

const resetSettings = () => {
  localStorage.clear()
  initializeSettings()
}

export {
  getFromStorage,
  initializeSettings,
  printPDF,
  getInvoiceDate,
  setProduct,
  setProducts,
  deleteProducts,
  getProducts,
  getPdf,
  getProductTypes,
  getInvoiceSettings,
  generateUuid4,
  groupBy,
  currency,
  closeNotification,
  restartApp,
  quitApp,
  resetSettings,
}
