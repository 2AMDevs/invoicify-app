/* eslint-disable no-restricted-globals */
import fontkit from '@pdf-lib/fontkit'
import * as toWords from 'convert-rupees-into-words'
import { PDFDocument } from 'pdf-lib'

import {
  currency, getFromStorage, getProducts, updatePrinterList,
} from '../services/dbService'
import {
  getAppVersion, getDefPrinter, getFileBuffer, isValidPath, printIt,
} from '../services/nodeService'
import {
  calculationSettings,
  COMPANY_NAME, CUSTOM_FONT, DATE, defaultPageSettings, defaultPrintSettings, FILE_TYPE,

  footerPrintSettings, ISET,

  MAX_ITEM_WIDTH, morePrintSettings, PAY_METHOD, PREVIEW, PRINT,
} from './constants'
import { getBoolFromString } from './utils'

// eslint-disable-next-line global-require

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

  localStorage.printer = localStorage.printer ?? await getDefPrinter()
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
  localStorage.version = await getAppVersion()
  localStorage.nativeGstinPrefix = localStorage.nativeGstinPrefix ?? '08'
  await updatePrinterList()
}

const printPDF = (pdfBytes) => printIt(pdfBytes, getFromStorage('printer'))

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

const getInvoiceSettings = (type = ISET.MAIN) => {
  const invoiceSettings = localStorage.getItem(type)
  return invoiceSettings ? JSON.parse(invoiceSettings) : []
}

const getSelectFontBuffer = async () => {
  const selectedFont = getFromStorage(FILE_TYPE.FONT)
  return (selectedFont !== CUSTOM_FONT && isValidPath(selectedFont))
    ? getFileBuffer(selectedFont)
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
    const existingPdfBytes = await getFileBuffer(previewPath)
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
    const isCN = item === PAY_METHOD.CHEQUENO
    if (isCN && !footer[item]) {
      startY -= 15
    } else if (footer[item]) {
      const textContent = `${isCN ? 'Chq No:' : item.toUpperCase()}: ${+footer[item]} ${isCN ? '' : '/-'}`
      const currX = startX + ((isCN || sameLine) ? (prevPayLen + 10) : 0)

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
              x: currX + 90,
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

const closeNotification = () => {
  const n = document.getElementById('notification')
  n.parentElement.parentElement.parentElement.classList.add('hidden')
}

const resetSettings = () => {
  const { password, products } = localStorage
  localStorage.clear()
  localStorage.password = password
  localStorage.products = products
  initializeSettings()
}

export {
  initializeSettings,
  printPDF,
  getInvoiceDate,
  getPdf,
  getInvoiceSettings,
  closeNotification,
  resetSettings,
}
