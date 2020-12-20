const { ipcRenderer } = require('electron')

const toggleFullScreen = () => {
  ipcRenderer.send('toggle-fullscreen')
}

const quitApp = () => {
  ipcRenderer.send('bye-bye')
}

const minimizeApp = () => {
  ipcRenderer.send('shut-up')
}

const restartApp = () => {
  ipcRenderer.send('restart_app')
}

const getPrintersList = async () => ipcRenderer.invoke('get-printers')

const isValidPath = async (path) => path && ipcRenderer.invoke('is-valid', path)

const getFileBuffer = async (file) => ipcRenderer.invoke('read-file-buffer', file)

const getAppVersion = async () => ipcRenderer.invoke('app_version')

const getDefPrinter = async () => ipcRenderer.invoke('get-def-printer')

const printIt = async (content, printer) => ipcRenderer.invoke('print-it', content, printer)

export {
  toggleFullScreen, quitApp, restartApp,
  minimizeApp, getPrintersList, isValidPath, getFileBuffer,
  getAppVersion, getDefPrinter, printIt,
}
