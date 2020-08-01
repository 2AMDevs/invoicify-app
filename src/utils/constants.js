const PREVIEW = 'preview'
const PRINT = 'print'
const DATE = 'Date'
const TEXT = 'Text'
const MASKED = 'Masked'
const CUSTOM_FONT = 'invoicify.ttf'
const ZERO = parseFloat(0)

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
  {
    key: 'column8',
    name: 'Total (₹)',
    fieldName: 'totalPrice',
    maxWidth: 60,
    minWidth: 60,
    isResizable: true,
    data: 'string',
    isPadded: false,
  },
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
    y: 695.52,
    required: true,
    disabled: true,
    type: TEXT,
    row: 1,
  },
  {
    name: 'Invoice Date',
    x: 485.42,
    y: 679.52,
    required: true,
    disabled: false,
    type: DATE,
    row: 1,
  },
  {
    name: 'Customer Name',
    x: 60,
    y: 672.52,
    required: true,
    disabled: false,
    type: TEXT,
    row: 2,
  },
  {
    name: 'GSTIN',
    x: 100,
    y: 645.52,
    required: true,
    disabled: false,
    type: MASKED,
    mask: '99-**********-***',
    row: 3,
  },
  {
    name: 'Mobile',
    x: 465.42,
    y: 645.52,
    required: true,
    disabled: false,
    type: MASKED,
    mask: '+\\91 9999999999',
    startIndex: 3,
    row: 3,
  },
  {
    name: 'Address',
    x: 325,
    y: 645.52,
    required: true,
    disabled: false,
    type: TEXT,
    row: 4,
  },
]

export {
  PRINT, PREVIEW, darkThemePalette, invoiceItemsTableColumns,
  productTableColumns, defaultPrintSettings,
  defaultPageSettings, fieldTypes, DATE, TEXT, MASKED, CUSTOM_FONT, ZERO,
}
