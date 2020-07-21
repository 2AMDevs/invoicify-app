import fontkit from '@pdf-lib/fontkit'
import { PDFDocument } from 'pdf-lib'

import {
  PREVIEW, PRINT, DATE, defaultPrintSettings, CUSTOM_FONT,
} from './constants'

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
  localStorage.productType = localStorage.productType ?? 'Gold, Silver'
  localStorage.invoiceSettings = localStorage.invoiceSettings
                                  ?? JSON.stringify(defaultPrintSettings)
}

const printPDF = (pdfBytes) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const blobUrl = window.URL.createObjectURL(blob)
  const iframeEle = document.getElementById('hidden-frame')
  iframeEle.src = blobUrl
  setTimeout(() => {
    if (iframeEle) {
      iframeEle.contentWindow.print()
    }
  }, 500)
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

  items.forEach((item, idx) => {
    const diff = idx * 15
    const commonStuff = {
      y: parseFloat(590 - diff),
      size: fontSize,
      font,
    }
    page.drawText((idx + 1).toString(), {
      x: parseFloat(45),
      ...commonStuff,
    })
    const product = getProducts(item.product)
    page.drawText(`${product?.name} [${product?.type}]`, {
      x: parseFloat(70),
      ...commonStuff,
    })
    const qtyText = item.quantity.toString()
    page.drawText(qtyText, {
      x: parseFloat(232 - font.widthOfTextAtSize(qtyText, fontSize)),
      ...commonStuff,
    })
    page.drawText(`${item.weight}gms`, {
      x: parseFloat(283 - font.widthOfTextAtSize(`${item.weight}gms`, fontSize)),
      ...commonStuff,
    })
    page.drawText(`${item.weight}gms`, {
      x: parseFloat(333 - font.widthOfTextAtSize(`${item.weight}gms`, fontSize)),
      ...commonStuff,
    })

    const priceText = `${item.price}/-`
    page.drawText(priceText, {
      x: parseFloat(380 - font.widthOfTextAtSize(priceText, fontSize)),
      ...commonStuff,
    })

    const mkgText = `${item.mkg}%`
    page.drawText(mkgText, {
      x: parseFloat(428 - font.widthOfTextAtSize(mkgText, fontSize)),
      ...commonStuff,
    })

    page.drawText(`${item.other}/-`, {
      x: parseFloat(478 - font.widthOfTextAtSize(`${item.other}/-`, fontSize)),
      ...commonStuff,
    })

    const totalPriceText = `${item.totalPrice.toFixed(2)}/-`
    page.drawText(totalPriceText, {
      x: parseFloat(560 - font.widthOfTextAtSize(totalPriceText, fontSize)),
      ...commonStuff,
    })
  })

  pdfDoc.setTitle('Invoice Preview')
  pdfDoc.setAuthor('2AM Devs')

  // Serialize the PDFDocument to base64
  return mode === PREVIEW ? pdfDoc.saveAsBase64({ dataUri: true }) : pdfDoc.save()
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
}
