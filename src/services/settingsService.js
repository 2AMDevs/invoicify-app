import {
  calculationSettings,
  COMPANY_NAME, CUSTOM_FONT, defaultPrintSettings, footerPrintSettings, ISET, morePrintSettings,
} from '../utils/constants'
import { getFromStorage, updatePrinterList } from './dbService'
import { getAppVersion, getDefPrinter } from './nodeService'

const initializeSettings = async () => {
  localStorage.companyName = localStorage.companyName ?? COMPANY_NAME
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.products = localStorage.products ?? '[]'
  localStorage.password = localStorage.password ?? ''
  localStorage.showFullMonth = localStorage.showFullMonth ?? true
  localStorage.printBoth = localStorage.printBoth ?? true
  localStorage.oldPurchaseFreedom = localStorage.oldPurchaseFreedom ?? true
  localStorage.email = localStorage.email ?? ''
  localStorage.productType = localStorage.productType ?? 'G, S'
  localStorage.customFont = localStorage.customFont ?? CUSTOM_FONT
  localStorage.customLockBg = localStorage.customLockBg ?? ''
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

const resetSettings = () => {
  const { password, products } = localStorage
  localStorage.clear()
  localStorage.password = password
  localStorage.products = products
  initializeSettings()
}

const getInvoiceSettings = (type = ISET.MAIN) => getFromStorage(type, 'json') ?? []

export { getInvoiceSettings, resetSettings, initializeSettings }
