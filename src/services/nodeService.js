const { ipcRenderer } = require('electron')

/** Toggles Fullscreen state of application */
const toggleFullScreen = () => ipcRenderer.send('toggle-fullscreen')

/** Force Sayonara! */
const quitApp = () => ipcRenderer.send('bye-bye')

/** Minimizes Client Application to Taskbar */
const minimizeApp = () => ipcRenderer.send('shut-up')

/** Restarts App, known to be called after update */
const restartApp = () => ipcRenderer.send('restart_app')

/**
 * @async
 * Retrievs Installed Printers List from OS
 * @return Array of Strings (Printer Names)
 */
const getPrintersList = async () => ipcRenderer.invoke('get-printers')

/**
 * @async
 * Checks if path given exists in User's machine
 * @param {string} path Path to file/folder
 * @return true if exits and valid else false
 */
const isValidPath = async (path) => path && ipcRenderer.invoke('file:is-valid', path)

/**
 * @async
 * Opens Save File Modal to save CSV with data in it
 * @param {Object} data JSON Object to be added as CSV
 * @param {boolean} fileFilter File Types to be allowed while saving
 * @param {boolean} disableAllFiles Boolean to check whether to allow *
 */
const saveCSV = async (data, fileFilter, disableAllFiles, fileName) => {
  // Don't export fields like 'id'
  const keys = Object.keys(data[0]).filter((k) => k !== 'id')
  // Print all keys first
  let csvData = `${keys.join(',')}\n`

  // Now Print each row in file
  data.forEach((d) => {
    keys.forEach((k) => {
      csvData += `${d[k]},`
    })
    csvData = `${csvData.slice(0, -1)}\n`
  })

  ipcRenderer.invoke('file:save', fileFilter, disableAllFiles, csvData, fileName)
}

/**
 * @async
 * Reads File Content using Node and turns them in Buffer
 * @param {string} Path to File (in public/)
 * @return Buffer content of file
 */
const getFileBuffer = async (file) => ipcRenderer.invoke('file:read-buffer', file)

/**
 * @async
 * Reads File Content using Node and turns them in Base64
 * @param {string} Path to File
 * @return Base64 content of file
 */
const getB64File = async (file) => ipcRenderer.invoke('file:read-b64', file)

/**
 * @async
 * Fetches application version from App Context
 * @return String containing version of App (Eg: v0.4.2)
 */
const getAppVersion = async () => ipcRenderer.invoke('app:version')

/**
 * @async
 * Fetches Default Printer from OS
 * @return Name of Default Printer
 */
const getDefPrinter = async () => ipcRenderer.invoke('printers:get-default')

/**
 * @async
 * Prints `content` buffer using `printer`
 * @param {UInt8} content Buffer of PDF to be printed
 * @param {string} printer Name of Printer to be used
 */
const printIt = async (content, printer) => ipcRenderer.invoke('printers:print', content, printer)

export {
  toggleFullScreen, quitApp, restartApp,
  minimizeApp, getPrintersList, isValidPath, getFileBuffer,
  getAppVersion, getDefPrinter, printIt, getB64File, saveCSV,
}
