/* eslint-disable no-restricted-globals */
import fontkit from '@pdf-lib/fontkit'
import * as toWords from 'convert-rupees-into-words'
import { PDFDocument } from 'pdf-lib'

import {
  PREVIEW, PRINT, DATE, defaultPrintSettings, ISET, FILE_TYPE, defaultPageSettings,
  CUSTOM_FONT, UPDATE_RESTART_MSG, morePrintSettings, calculationSettings, PAY_METHOD,
  MAX_ITEM_WIDTH, COMPANY_NAME, footerPrintSettings,
} from './constants'

// eslint-disable-next-line global-require
const { ipcRenderer } = require('electron')

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

const quantize = (val) => (isNaN(parseFloat(val))
  ? 0 : +val)

const printerList = async () => {
  const list = await ipcRenderer.invoke('get-printers')
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

const initializeSettings = async () => {
  localStorage.companyName = localStorage.companyName ?? COMPANY_NAME
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.products = localStorage.products ?? '[]'
  localStorage.password = localStorage.password ?? ''
  localStorage.showFullMonth = localStorage.showFullMonth ?? true
  localStorage.printBoth = localStorage.printBoth ?? true
  localStorage.oldPurchaseFreedom = localStorage.oldPurchaseFreedom ?? true
  localStorage.productType = localStorage.productType ?? 'G, S'
  localStorage.customFont = localStorage.customFont ?? CUSTOM_FONT
  localStorage.currency = localStorage.currency ?? '₹'
  localStorage.invoiceSettings = localStorage.invoiceSettings
                                  ?? JSON.stringify(defaultPrintSettings)

  localStorage.printer = localStorage.printer ?? await ipcRenderer.invoke('get-def-printer')
  localStorage.morePrintSettings = JSON.stringify({
    ...morePrintSettings,
    ...(localStorage.morePrintSettings && JSON.parse(localStorage.morePrintSettings)),
  })
  localStorage.footerPrintSettings = JSON.stringify({
    ...footerPrintSettings,
    ...(localStorage.footerPrintSettings && JSON.parse(localStorage.footerPrintSettings)),
  })
  localStorage.calculationSettings = JSON.stringify({
    ...calculationSettings,
    ...(localStorage.calculationSettings && JSON.parse(localStorage.calculationSettings)),
  })
  localStorage.version = await ipcRenderer.invoke('app_version')
  localStorage.nativeGstinPrefix = localStorage.nativeGstinPrefix ?? '08'
  await updatePrinterList()
}

const printPDF = (pdfBytes) => ipcRenderer.invoke('print-it', pdfBytes, getFromStorage('printer'))

const toggleFullScreen = () => {
  ipcRenderer.send('toggle-fullscreen')
}

const getInvoiceDate = (date) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
  }
  const hindiDate = getFromStorage('hindiDate')
  const showFullMonth = getFromStorage('showFullMonth')
  return showFullMonth
    ? date.toLocaleDateString(`${hindiDate ? 'hi' : 'en'}-IN`, options)
    : `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
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

const titleCase = (string) => string.replace(/([A-Z])/g, ' $1')
  .replace(/^./, (str) => str.toUpperCase())

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

const getInvoiceSettings = (type = ISET.MAIN) => {
  const invoiceSettings = localStorage.getItem(type)
  return invoiceSettings ? JSON.parse(invoiceSettings) : []
}

const isValidPath = async (path) => path && ipcRenderer.invoke('is-valid', path)

const getSelectFontBuffer = async () => {
  const selectedFont = getFromStorage(FILE_TYPE.FONT)
  return (selectedFont !== CUSTOM_FONT && isValidPath(selectedFont))
    ? ipcRenderer.invoke('read-file-buffer', selectedFont)
    : fetch(CUSTOM_FONT).then((res) => res.arrayBuffer())
}

const getPdf = async (invoiceDetails, mode = PRINT) => {
  const { meta, items, footer } = invoiceDetails
  let pdfDoc
  const previewPath = getFromStorage(FILE_TYPE.PDF)
  const legit = await isValidPath(previewPath)
  const isPreviewMode = (mode === PREVIEW) && previewPath
  if (isPreviewMode) {
    if (!legit) {
      return { error: 'Please fix Preview PDF Path in Settings' }
    }
    const existingPdfBytes = await ipcRenderer.invoke('read-file-buffer', previewPath)
    pdfDoc = await PDFDocument.load(existingPdfBytes)
  } else {
    pdfDoc = await PDFDocument.create()
  }

  pdfDoc.registerFontkit(fontkit)
  const { fontSize } = defaultPageSettings
  const font = await pdfDoc.embedFont(await getSelectFontBuffer(), { subset: true })
  const commonFont = { font, size: fontSize }
  const page = isPreviewMode ? pdfDoc.getPages()[0] : pdfDoc.addPage()

  const printSettings = getInvoiceSettings(ISET.PRINT)
  // Print Invoice Copy Type
  const copyText = `[${mode === PREVIEW ? 'Duplicate' : 'Original'} Invoice]`
  page.drawText(copyText, {
    x: printSettings.copyTypeXEnd - (font.widthOfTextAtSize(copyText, fontSize)),
    y: printSettings.copyTypeY,
    size: fontSize,
    font,
  })

  // Print Invoice Header
  getInvoiceSettings().forEach((field) => {
    if (meta[field.name]) {
      const value = field.type === DATE
        ? getInvoiceDate(meta[field.name])
        : meta[field.name].toString()
      page.drawText(value, {
        x: parseFloat(field.x),
        y: parseFloat(field.y),
        size: parseFloat(field.size) ?? fontSize,
        font,
      })
    }
  })

  // Print Items
  let idx = -1
  items.filter((it) => !it.isOldItem).forEach((item, serial) => {
    idx += 1
    const commonStuff = (x, text, fromStart) => {
      const stringifiedText = text.toString()
      const adjustment = !fromStart ? (font.widthOfTextAtSize(stringifiedText, fontSize)) : 0
      return [stringifiedText,
        {
          x: parseFloat(x - adjustment),
          y: parseFloat(printSettings.itemStartY - idx * printSettings.diffBetweenItemsY),
          ...commonFont,
        },
      ]
    }

    const product = getProducts(item.product)
    if (product?.name) {
      page.drawText(...commonStuff(45, (serial + 1)), true)
      // type at the end of col
      page.drawText(...commonStuff(190, `[${product?.type}]`, true))
      page.drawText(...commonStuff(232, item.quantity))
      page.drawText(...commonStuff(283, item.gWeight))
      page.drawText(...commonStuff(333, item.weight))
      page.drawText(...commonStuff(380, `${currency(item.price, true)}/-`))
      page.drawText(...commonStuff(428, `${currency(item.mkg)}%`))
      page.drawText(...commonStuff(478, `${currency(item.other, true)}/-`))
      page.drawText(...commonStuff(560, `${currency(item.totalPrice, true)}/-`))

      if (font.widthOfTextAtSize(`${product?.name}`, fontSize) > MAX_ITEM_WIDTH) {
        let toPrint = ''
        const bits = product?.name?.split(' ')
        let maxWidth = MAX_ITEM_WIDTH
        bits.forEach((bit) => {
          if (font.widthOfTextAtSize(`${toPrint} ${bit}`, fontSize) > maxWidth) {
            page.drawText(...commonStuff(70, toPrint, true))
            toPrint = ''
            idx += 1
            maxWidth = MAX_ITEM_WIDTH + font.widthOfTextAtSize(`[${product?.type}]`, fontSize)
          }
          toPrint += `${toPrint.length ? ' ' : ''}${bit}`
        })
        if (toPrint) {
          page.drawText(...commonStuff(70, toPrint, true))
        }
      } else {
        page.drawText(...commonStuff(70, `${product?.name}`, true))
      }
    }
  })

  // Print Footer
  const footerCommonParts = (y, key, x) => {
    const text = `${currency(footer[key])}/-`
    return [
      text,
      {
        x: x ?? parseFloat(printSettings.endAmountsX - font.widthOfTextAtSize(text, fontSize)),
        y,
        ...commonFont,
      },
    ]
  }

  page.drawText(...footerCommonParts(230, 'grossTotal'))
  page.drawText(...footerCommonParts(210, 'cgst'))
  page.drawText(...footerCommonParts(190, 'sgst'))
  page.drawText(...footerCommonParts(170, 'igst'))
  page.drawText(...footerCommonParts(148, 'totalAmount'))
  page.drawText(...footerCommonParts(128, 'oldPurchase'))
  page.drawText(...footerCommonParts(108, 'grandTotal'))

  const calcSettings = getInvoiceSettings(ISET.CALC)

  const towWordsText = getBoolFromString(calcSettings.roundOffToWords)
    ? Math.round(Math.abs(footer.grandTotal)) : Math.abs(footer.grandTotal)

  page.drawText(`${footer.grandTotal < 0 ? 'Minus ' : ''}${toWords(towWordsText)}`, {
    x: 92,
    y: 88,
    ...commonFont,
  })

  // oldPurchase Stuff
  const oldItems = {}
  const oldItemList = items.filter((it) => it.isOldItem)
  oldItemList.forEach((item) => {
    oldItems.names = (oldItems.names?.length ? `${oldItems.names}, ` : '') + item.type
    oldItems.purity = `${oldItems.purity?.length ? `${oldItems.purity}, ` : ''}${item.purity}%`
    oldItems.price = `${oldItems.price?.length ? `${oldItems.price}, ` : ''}${currency(item.price)}/-`
    oldItems.gWeight = `${oldItems.gWeight?.length ? `${oldItems.gWeight}, ` : ''}${item.gWeight}g`
    oldItems.weight = `${oldItems.weight?.length ? `${oldItems.weight}, ` : ''}${item.weight}g`
    oldItems.totalPrice = `${oldItems.totalPrice?.length ? `${oldItems.totalPrice}, ` : ''}${currency(item.totalPrice)}/-`
  })

  if (oldItemList.length) {
    page.drawText(oldItems.names, {
      x: 67,
      y: 150,
      ...commonFont,
    })

    page.drawText(oldItems.purity, {
      x: 73,
      y: 130,
      ...commonFont,
    })
    page.drawText(oldItems.price, {
      x: 216,
      y: 130,
      ...commonFont,
    })
    page.drawText(oldItems.gWeight, {
      x: 110,
      y: 109,
      ...commonFont,
    })
    page.drawText(oldItems.weight, {
      x: 248,
      y: 109,
      ...commonFont,
    })
    page.drawText(oldItems.totalPrice, {
      x: 348,
      y: 109,
      ...commonFont,
    })
  }

  // Print Distribution
  const startX = 210
  const yLimit = 190
  let startY = 220
  let prevPayLen = 0
  let sameLine = false
  Object.values(PAY_METHOD).forEach((item) => {
    if (footer[item]) {
      const isCN = item === PAY_METHOD.CHEQUENO

      const textContent = `${isCN ? 'Cheque No.:' : item.toUpperCase()}: ${footer[item]} ${isCN ? '' : '/-'}`
      const currX = startX + ((isCN || sameLine) ? (prevPayLen + 15) : 0)

      if (isCN && !footer[PAY_METHOD.CHEQUE]) {
        // eslint-disable-next-line no-console
        console.log('No Cheques Please')
      } else {
        page.drawText(
          textContent, {
            x: currX,
            y: startY,
            ...commonFont,
          },
        )

        if (isCN) {
          page.drawLine({
            start: {
              x: currX,
              y: startY - 2.3,
            },
            end: {
              y: startY - 2.3,
              x: currX + 55,
            },
            thickness: 2,
            opacity: 0.75,
          })
        }
        sameLine = (startY === yLimit)
        startY -= ((item === PAY_METHOD.CHEQUE) || sameLine ? 0 : 15)
        prevPayLen = font.widthOfTextAtSize(textContent, fontSize)
      }
    }
  })

  pdfDoc.setTitle('Invoice Preview')
  pdfDoc.setAuthor(COMPANY_NAME)

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

ipcRenderer.on('updateDownloaded', (_event, info) => {
  const notification = document.getElementById('notification')
  const message = document.getElementById('message')
  const restartButton = document.getElementById('restart-button')
  if (message) message.innerText = UPDATE_RESTART_MSG
  restartButton.classList.remove('hidden')
  localStorage.version = info.version
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

const minimizeApp = () => {
  ipcRenderer.send('shut-up')
}

const closeNotification = () => {
  const n = document.getElementById('notification')
  n.parentElement.parentElement.parentElement.classList.add('hidden')
}

const restartApp = () => {
  ipcRenderer.send('restart_app')
}

const resetSettings = () => {
  const { password, products } = localStorage
  localStorage.clear()
  localStorage.password = password
  localStorage.products = products
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
  minimizeApp,
  resetSettings,
  titleCase,
  updatePrinterList,
  isValidPath,
  toggleFullScreen,
  quantize,
}
