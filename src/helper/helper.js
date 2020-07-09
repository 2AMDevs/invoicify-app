const getFromStorage = (key, type) => {
  const value = localStorage[key]
  if (type === 'num') {
    const intVal = parseInt(value, 10)
    // eslint-disable-next-line no-restricted-globals
    return isNaN(intVal) ? 1 : intVal
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

const initializeSettings = () => {
  localStorage.companyName = localStorage.companyName ?? 'Tesla Parchuni'
  localStorage.invoiceNumber = localStorage.invoiceNumber ?? 1
  localStorage.settingsOne = localStorage.settingsOne ?? true
  localStorage.checkForUpdates = localStorage.checkForUpdates ?? true
}

const setProduct = (product) => {
  const products = JSON.parse(localStorage.getItem('products')) || []
  localStorage.setItem('products', JSON.stringify([...products, product]))
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

export {
  getFromStorage,
  initializeSettings,
  productTableColumns,
  setProduct,
  getProducts,
}
