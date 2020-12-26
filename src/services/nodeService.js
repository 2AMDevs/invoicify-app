const { ipcRenderer } = require('electron')

/**
 * Toggles Fullscreen state of application
 */
const toggleFullScreen = () => ipcRenderer.send('toggle-fullscreen')

/**
 * Force Sayonara!
 */
const quitApp = () => ipcRenderer.send('bye-bye')

/**
 * Minimizes Client Application to Taskbar
 */
const minimizeApp = () => ipcRenderer.send('shut-up')

/**
 * Restarts App, known to be called after update
 */
const restartApp = () => ipcRenderer.send('restart_app')

/**
 * @async
 * Retrievs Installed Printers List from OS
 * @returns Array of Strings (Printer Names)
 */
const getPrintersList = async () => ipcRenderer.invoke('get-printers')

/**
 * @async
 * Checks if path given exists in User's machine
 * @param path {string} Path to file/folder
 * @returns true if exits and valid else false
 */
const isValidPath = async (path) => path && ipcRenderer.invoke('is-valid', path)

/**
 * @async
 * Reads File Content using Node and turns them in Buffer
 * @param file {string} Path to File (in public/)
 * @returns Buffer content of file
 */
const getFileBuffer = async (file) => ipcRenderer.invoke('read-file-buffer', file)

/**
 * @async
 * Fetches application version from App Context
 * @returns String containing version of App (Eg: v0.4.2)
 */
const getAppVersion = async () => ipcRenderer.invoke('app_version')

/**
 * @async
 * Fetches Default Printer from OS
 * @returns Name of Default Printer
 */
const getDefPrinter = async () => ipcRenderer.invoke('get-def-printer')

/**
 * @async
 * Prints `content` buffer using `printer`
 * @param content {UInt8} Buffer of PDF to be printed
 * @param printer {string} Name of Printer to be used
 */
const printIt = async (content, printer) => ipcRenderer.invoke('print-it', content, printer)

export {
  toggleFullScreen, quitApp, restartApp,
  minimizeApp, getPrintersList, isValidPath, getFileBuffer,
  getAppVersion, getDefPrinter, printIt,
}
