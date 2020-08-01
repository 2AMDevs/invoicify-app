/* eslint-disable no-restricted-globals */
import fontkit from '@pdf-lib/fontkit'
import * as toWords from 'convert-rupees-into-words'
import { PDFDocument } from 'pdf-lib'

import {
  PREVIEW, PRINT, DATE, defaultPrintSettings, CUSTOM_FONT,
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

const getInvoiceSettings = () => {
  const invoiceSettings = localStorage.getItem('invoiceSettings')
  return invoiceSettings ? JSON.parse(invoiceSettings) : []
}

const getPdf = async (invoiceDetails, mode = PRINT) => {
  const { meta, items } = invoiceDetails
  let pdfDoc
  const previewURL = getFromStorage('previewPDFUrl')
  const isPreviewMode = (mode === PREVIEW) && previewURL
  const ourFont = await fetch(CUSTOM_FONT).then((res) => res.arrayBuffer())
  if (isPreviewMode) {
    const existingPdfBytes = await fetch(previewURL).then((res) => res.arrayBuffer())
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
  items.forEach((item, idx) => {
    const diff = idx * 15
    const commonStuff = {
      y: parseFloat(590 - diff),
      size: fontSize,
      font,
    }
    const product = getProducts(item.product)
    if (product?.name) {
      page.drawText((idx + 1).toString(), {
        x: parseFloat(45),
        ...commonStuff,
      })
      page.drawText(`${product?.name} [${product?.type}]`, {
        x: parseFloat(70),
        ...commonStuff,
      })
      const qtyText = item.quantity.toString()
      page.drawText(qtyText, {
        x: parseFloat(232 - font.widthOfTextAtSize(qtyText, fontSize)),
        ...commonStuff,
      })
      page.drawText(`${item.gWeight}gms`, {
        x: parseFloat(283 - font.widthOfTextAtSize(`${item.gWeight}gms`, fontSize)),
        ...commonStuff,
      })
      page.drawText(`${item.weight}gms`, {
        x: parseFloat(333 - font.widthOfTextAtSize(`${item.weight}gms`, fontSize)),
        ...commonStuff,
      })

      const priceText = `${currency(item.price)}/-`
      page.drawText(priceText, {
        x: parseFloat(380 - font.widthOfTextAtSize(priceText, fontSize)),
        ...commonStuff,
      })

      const mkgText = `${currency(item.mkg)}%`
      page.drawText(mkgText, {
        x: parseFloat(428 - font.widthOfTextAtSize(mkgText, fontSize)),
        ...commonStuff,
      })

      page.drawText(`${currency(item.other)}/-`, {
        x: parseFloat(478 - font.widthOfTextAtSize(`${currency(item.other)}/-`, fontSize)),
        ...commonStuff,
      })

      const totalPriceText = `${currency(item.totalPrice).toFixed(2)}/-`
      page.drawText(totalPriceText, {
        x: parseFloat(560 - font.widthOfTextAtSize(totalPriceText, fontSize)),
        ...commonStuff,
      })
    }
  })

  // Print Footer
  const grossTotal = `${meta.grossTotal.toFixed(2)}/-`
  page.drawText(grossTotal, {
    x: parseFloat(560 - font.widthOfTextAtSize(grossTotal, fontSize)),
    y: 210,
    size: fontSize,
    font,
  })

  const cgst = `${meta.cgst.toFixed(2)}/-`
  page.drawText(cgst, {
    x: parseFloat(560 - font.widthOfTextAtSize(cgst, fontSize)),
    y: 190,
    size: fontSize,
    font,
  })

  const sgst = `${meta.sgst.toFixed(2)}/-`
  page.drawText(sgst, {
    x: parseFloat(560 - font.widthOfTextAtSize(sgst, fontSize)),
    y: 170,
    size: fontSize,
    font,
  })

  const igst = `${meta.igst.toFixed(2)}/-`
  page.drawText(igst, {
    x: parseFloat(560 - font.widthOfTextAtSize(igst, fontSize)),
    y: 150,
    size: fontSize,
    font,
  })

  const totalAmount = `${meta.totalAmount.toFixed(2)}/-`
  page.drawText(totalAmount, {
    x: parseFloat(560 - font.widthOfTextAtSize(totalAmount, fontSize)),
    y: 130,
    size: fontSize,
    font,
  })

  const oldPurchase = `${currency(meta.oldPurchase).toFixed(2)}/-`
  page.drawText(oldPurchase, {
    x: parseFloat(560 - font.widthOfTextAtSize(oldPurchase, fontSize)),
    y: 110,
    size: fontSize,
    font,
  })

  const grandTotal = `${meta.grandTotal.toFixed(2)}/-`
  page.drawText(grandTotal, {
    x: parseFloat(560 - font.widthOfTextAtSize(grandTotal, fontSize)),
    y: 90,
    size: fontSize,
    font,
  })

  page.drawText(toWords(meta.grandTotal), {
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
  console.log('Its Done')
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?'
  restartButton.classList.remove('hidden')
  notification.parentElement.parentElement.parentElement.classList.remove('hidden')
})

const closeNotification = () => {
  const n = document.getElementById('notification')
  n.parentElement.parentElement.parentElement.classList.add('hidden')
}

const restartApp = () => {
  ipcRenderer.send('restart_app')
}

export {
  getFromStorage,
  initializeSettings,
  printPDF,
  getInvoiceDate,
  setProduct,
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
}
