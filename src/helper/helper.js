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

const productTableColumns = [
  {
    key: 'column1',
    name: 'id',
    ariaLabel: 'Id of the item',
    iconName: 'List',
    isIconOnly: true,
    fieldName: 'id',
    minWidth: 16,
    maxWidth: 16,
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
    minWidth: 50,
    maxWidth: 90,
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
    minWidth: 50,
    maxWidth: 90,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'number',
    isPadded: true,
  },
]

export { getFromStorage, initializeSettings, productTableColumns }
