const PREVIEW = 'preview'
const PRINT = 'print'

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

const defaultPageSettings = { width: 595.42, height: 895.04, fontSize: 11 }

const defaultPrintSettings = [
  {
    name: 'Invoice Number',
    x: 90,
    y: 447.52 + 248,
  },
  {
    name: 'Invoice Date',
    x: 485.42,
    y: 447.52 + 250,
  },
  {
    name: 'Customer Name',
    x: 60,
    y: 447.52 + 225,
  },
  {
    name: 'GSTIN',
    x: 100,
    y: 447.52 + 198,
  },
  {
    name: 'Mobile',
    x: 465.42,
    y: 447.52 + 198,
  },
  {
    name: 'Address',
    x: 325,
    y: 447.52 + 198,
  },
]

export {
  PRINT, PREVIEW, darkThemePalette, productTableColumns, defaultPrintSettings, defaultPageSettings,
}
