const PREVIEW = 'preview'
const PRINT = 'print'
const DATE = 'Date'
const TEXT = 'Text'
const MASKED = 'Masked'
const CUSTOM_FONT = 'invoicify.ttf'
const ZERO = parseFloat(0)
const UPDATE_RESTART_MSG = 'Update Downloaded. It will be installed on restart. Restart now?'

const ISET = {
  MAIN: 'invoiceSettings',
  PRINT: 'morePrintSettings',
  CALC: 'calculationSettings',
}

const ERROR = {
  FILE_MOVED: 'File Selected is either moved or renamed.',
}

const PAY_METHOD = {
  CASH: 'cash',
  CHEQUE: 'cheque',
  UPI: 'upi',
  CARD: 'card',
}

const FILE_TYPE = {
  PDF: 'previewPDFUrl',
  FONT: 'customFont',
}

const SELECT_FILE_TYPE = {
  EXCEL: { name: 'Spreadsheets', extensions: ['xlsx', 'xls'] },
  PDF: { name: 'PDF', extensions: ['pdf'] },
  FONT: { name: 'Fonts', extensions: ['ttf', 'otf'] },
}

const MAX_ITEM_WIDTH = 117

const darkThemePalette = {
  themePrimary: '#209cfa',
  themeLighterAlt: '#01060a',
  themeLighter: '#051928',
  themeLight: '#0a2f4b',
  themeTertiary: '#135d96',
  themeSecondary: '#1d89dc',
  themeDarkAlt: '#36a5fa',
  themeDark: '#55b3fb',
  themeDarker: '#81c7fc',
  neutralLighterAlt: '#23272A',
  neutralLighter: '#72767d',
  neutralLight: '#4f545c',
  neutralQuaternaryAlt: '#0d0d0d',
  neutralQuaternary: '#0c0c0c',
  neutralTertiaryAlt: '#72767d',
  neutralTertiary: '#b9bbbe',
  neutralSecondary: '#fcfcfc',
  neutralPrimaryAlt: '#fdfdfd',
  neutralPrimary: '#fafafa',
  neutralDark: '#fefefe',
  black: '#fefefe',
  white: '#23272A',
}

const productTableColumns = [
  {
    key: 'column1',
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
    key: 'column2',
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
]

const commonInvoiceTableColumns = [
  {
    key: 'column3',
    name: 'Weight',
    fieldName: 'gWeight',
    maxWidth: 35,
    minWidth: 35,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column4',
    name: 'Net Weight',
    fieldName: 'weight',
    maxWidth: 50,
    minWidth: 50,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column5',
    name: 'Rate',
    fieldName: 'price',
    maxWidth: 55,
    minWidth: 55,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
]

const totalColumn = {
  key: 'column8',
  name: 'Total (₹)',
  fieldName: 'totalPrice',
  maxWidth: 60,
  minWidth: 60,
  isResizable: true,
  data: 'string',
  isPadded: false,
}

const invoiceItemsTableColumns = [
  {
    key: 'column2',
    name: 'Pcs',
    fieldName: 'quantity',
    isResizable: true,
    maxWidth: 30,
    minWidth: 30,
    data: 'string',
    isPadded: true,
  },
  ...commonInvoiceTableColumns,
  {
    key: 'column6',
    name: 'MKG (%)',
    fieldName: 'mkg',
    maxWidth: 35,
    minWidth: 35,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column7',
    name: 'Other (₹)',
    fieldName: 'other',
    maxWidth: 60,
    minWidth: 60,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
  totalColumn,
]

const oldInvoiceItemsTableColumns = [
  {
    key: 'column2',
    name: 'Purity',
    fieldName: 'purity',
    isResizable: true,
    maxWidth: 50,
    minWidth: 50,
    data: 'string',
    isPadded: true,
  },
  ...commonInvoiceTableColumns,
  totalColumn,
]

const defaultPageSettings = { width: 595.42, height: 895.04, fontSize: 11 }

const fieldTypes = [
  { key: DATE, text: DATE },
  { key: TEXT, text: TEXT },
  { key: MASKED, text: MASKED },
]

const defaultPrintSettings = [
  {
    name: 'Invoice Number',
    x: 90,
    y: 695,
    required: true,
    disabled: true,
    type: TEXT,
    row: 1,
    size: defaultPageSettings.fontSize,
    disableNameChange: true,
  },
  {
    name: 'Invoice Date',
    x: 485.42,
    y: 694.52,
    required: true,
    disabled: false,
    type: DATE,
    row: 1,
    size: defaultPageSettings.fontSize,
    disableNameChange: true,
  },
  {
    name: 'Customer Name',
    x: 60,
    y: 672.52,
    required: true,
    disabled: false,
    type: TEXT,
    row: 2,
    size: defaultPageSettings.fontSize,
  },
  {
    name: 'GSTIN',
    x: 100,
    y: 645.52,
    required: true,
    disabled: false,
    type: TEXT,
    regex: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
    row: 3,
    size: defaultPageSettings.fontSize,
  },
  {
    name: 'Mobile',
    x: 465.42,
    y: 645.52,
    required: true,
    disabled: false,
    type: TEXT,
    inputLength: 10,
    prefix: '+91',
    regex: '\\+?\\d[\\d -]{8,12}\\d',
    startIndex: 3,
    row: 3,
    size: defaultPageSettings.fontSize,
  },
  {
    name: 'Address',
    x: 325,
    y: 645.52,
    required: true,
    disabled: false,
    type: TEXT,
    row: 4,
    size: defaultPageSettings.fontSize,
  },
]

const morePrintSettings = {
  itemStartY: 590,
  diffBetweenItemsY: 15,
  diffBetweenAmountsY: 20,
  endAmountsX: 560,
}

const calculationSettings = {
  cgst: 1.5,
  sgst: 1.5,
  igst: 3,
  roundOffToWords: true,
}

export {
  PRINT, PREVIEW, darkThemePalette, invoiceItemsTableColumns, ISET, FILE_TYPE, PAY_METHOD,
  productTableColumns, defaultPrintSettings, morePrintSettings, calculationSettings,
  defaultPageSettings, fieldTypes, DATE, TEXT, MASKED, CUSTOM_FONT, ZERO, UPDATE_RESTART_MSG,
  SELECT_FILE_TYPE, oldInvoiceItemsTableColumns, ERROR, MAX_ITEM_WIDTH,
}
