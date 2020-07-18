import fontkit from '@pdf-lib/fontkit'
import { PDFDocument } from 'pdf-lib'

import { PREVIEW, PRINT, defaultPrintSettings } from './constants'

const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    // eslint-disable-next-line no-restricted-globals
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

const initializeSettings = () => {
  localStorage.companyName = localStorage.companyName ?? 'Tesla Parchuni'
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.checkForUpdates = localStorage.checkForUpdates ?? true
  localStorage.products = localStorage.products ?? '[]'
  localStorage.invoiceSettings = localStorage.invoiceSettings
                                  ?? JSON.stringify(defaultPrintSettings)
}

const downloadPDF = (pdfBytes, invoiceNumber) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.id = `invoice-${invoiceNumber.toString()}`
  link.download = `invoice-${invoiceNumber.toString()}.pdf`
  link.click()
}

const getInvoiceDate = () => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
  }
  const today = new Date()
  return today.toLocaleDateString('en-IN', options)
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

const getProducts = () => {
  const products = localStorage.getItem('products')
  return products ? JSON.parse(products) : []
}

const getInvoiceSettings = () => {
  const invoiceSettings = localStorage.getItem('invoiceSettings')
  return invoiceSettings ? JSON.parse(invoiceSettings) : []
}

// TIL:  String.fromCharCode function has limit to arguements, hence this process
const pdfToBase64 = (pdfBytes) => btoa(new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), ''))

const getPdf = async (invoice, mode = PRINT) => {
  let pdfDoc
  const previewURL = getFromStorage('previewPDFUrl')
  const isPreviewMode = (mode === PREVIEW) && previewURL
  const mangalFont = await fetch('Manbant.ttf').then((res) => res.arrayBuffer())
  if (isPreviewMode) {
    const existingPdfBytes = await fetch(previewURL).then((res) => res.arrayBuffer())
    pdfDoc = await PDFDocument.load(existingPdfBytes)
  } else {
    pdfDoc = await PDFDocument.create()
  }

  // Register the `fontkit` instance
  pdfDoc.registerFontkit(fontkit)
  const font = await pdfDoc.embedFont(mangalFont)
  const fontSize = 11

  const page = isPreviewMode ? pdfDoc.getPages()[0] : pdfDoc.addPage()

  // Get the width and height of the first page
  // const { width, height } = page.getSize()

  getInvoiceSettings().forEach((field) => {
    if (invoice[field.name]) {
      page.drawText(invoice[field.name].toString(), {
        x: parseFloat(field.x, 10),
        y: parseFloat(field.y, 10),
        size: fontSize,
        font,
      })
    }
  })

  pdfDoc.setTitle('Invoice Preview')
  pdfDoc.setAuthor('2AM Devs')

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  return pdfToBase64(pdfBytes)
}

export {
  getFromStorage,
  initializeSettings,
  downloadPDF,
  getInvoiceDate,
  setProduct,
  deleteProducts,
  getProducts,
  getPdf,
  pdfToBase64,
  getProductTypes,
  getInvoiceSettings,
}
