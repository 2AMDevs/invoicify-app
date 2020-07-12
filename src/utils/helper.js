import { PDFDocument, StandardFonts } from 'pdf-lib'

import { PREVIEW, PRINT } from './constants'

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
  localStorage.settingsOne = localStorage.settingsOne ?? true
  localStorage.checkForUpdates = localStorage.checkForUpdates ?? true
  localStorage.products = localStorage.product ?? '[]'
}

const downloadPDF = (pdfBytes, invoiceNumber) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.id = `invoice-${invoiceNumber.toString()}`
  link.download = `invoice-${invoiceNumber.toString()}.pdf`
  link.click()
  // link.id.remove()
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
  if (!products) return []

  return JSON.parse(products)
}

const productTableColumns = [
  {
    key: 'column1',
    name: 'id',
    ariaLabel: 'Id of the item',
    iconName: 'List',
    isIconOnly: true,
    fieldName: 'id',
    minWidth: 50,
    maxWidth: 50,
  },
  {
    key: 'column2',
    name: 'Name',
    fieldName: 'name',
    minWidth: 210,
    maxWidth: 350,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column3',
    name: 'Type',
    fieldName: 'type',
    minWidth: 40,
    maxWidth: 40,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column4',
    name: 'Price',
    fieldName: 'price',
    minWidth: 30,
    maxWidth: 30,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'number',
    isPadded: true,
  },
]

const pdfToBase64 = (pdfBytes) => btoa(String.fromCharCode(...new Uint8Array(pdfBytes)))

const getPdf = async (invoice, mode = PRINT) => {
  let pdfDoc
  const {
    invoiceNumber, customerName, mobile, address, gstin,
  } = invoice
  const previewURL = getFromStorage('previewPDFUrl')
  const isPreviewMode = (mode === PREVIEW) && previewURL
  if (isPreviewMode) {
    const existingPdfBytes = await fetch(previewURL).then((res) => res.arrayBuffer())
    pdfDoc = await PDFDocument.load(existingPdfBytes)
  } else {
    pdfDoc = await PDFDocument.create()
  }

  // Embed the Helvetica font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const fontSize = 11

  const page = isPreviewMode ? pdfDoc.getPages()[0] : pdfDoc.addPage()

  // Get the width and height of the first page
  const { width, height } = page.getSize()

  // Draw a string of text diagonally across the first page
  page.drawText(invoiceNumber.toString(), {
    x: 90,
    y: height / 2 + 273,
    size: fontSize,
    font,
  })

  page.drawText(getInvoiceDate(), {
    x: width - 110,
    y: height / 2 + 275,
    size: fontSize,
    font,
  })

  page.drawText(customerName, {
    x: 60,
    y: height / 2 + 250,
    size: fontSize,
    font,
  })

  page.drawText(gstin, {
    x: 100,
    y: height / 2 + 223,
    size: fontSize,
    font,
  })

  page.drawText(mobile, {
    x: width - 130,
    y: height / 2 + 223,
    size: fontSize,
    font,
  })

  page.drawText(address, {
    x: 325,
    y: height / 2 + 223,
    size: fontSize,
    font,
  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  return pdfToBase64(pdfBytes)
}

export {
  getFromStorage,
  initializeSettings,
  productTableColumns,
  downloadPDF,
  getInvoiceDate,
  setProduct,
  deleteProducts,
  getProducts,
  getPdf,
  pdfToBase64,
  getProductTypes,
}
