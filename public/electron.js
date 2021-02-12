/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const {
  app, BrowserWindow, Menu, screen, ipcMain, dialog, shell,
} = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')
const readXlsxFile = require('read-excel-file/node')

const { print, getPrinters, getDefaultPrinter } = require('./printPdf')

if (isDev) {
  // eslint-disable-next-line global-require
  require('electron-reload')(__dirname, {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron.cmd'),
  })
}

let win

const createWindow = () => {
  Menu.setApplicationMenu(null)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: !!isDev,
      plugins: true,
    },
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )

  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  // TODO: Add Tweak to open this when 7 press on Home button, so that we can debug prod
  if (isDev) win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)
app.on('ready', () => {
  createWindow()

  if (!isDev) {
    autoUpdater.setFeedURL({
      provider: 'github', owner: process.env.OWNER, repo: process.env.REPO, token: process.env.GH_TOKEN,
    })
    autoUpdater.checkForUpdates()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const getFilePath = async (fileFilters, disableAllFiles = false) => {
  const filters = [
    ...(fileFilters || []),
    ...(!disableAllFiles ? [{ name: 'All Files', extensions: ['*'] }] : []),
  ]
  const file = await dialog.showOpenDialog({ properties: ['openFile'], filters })
  if (file) {
    return file.filePaths[0]
  }
}

ipcMain.on('bye-bye', () => {
  win.close()
})

ipcMain.on('toggle-fullscreen', () => {
  win.setFullScreen(!win.isFullScreen())
})

ipcMain.on('shut-up', () => {
  win.minimize()
})

ipcMain.handle('app_version', () => app.getVersion())
ipcMain.handle('select-file', (_event, filters, disableAllFiles) => getFilePath([filters], disableAllFiles))
ipcMain.handle('get-printers', getPrinters)
ipcMain.handle('get-def-printer', getDefaultPrinter)
ipcMain.handle('is-valid', (_event, args) => fs.existsSync(args))
ipcMain.handle('print-it', async (_e, pdfBytes, selectedPrinter) => print(pdfBytes, selectedPrinter))

ipcMain.handle('products-excel-to-json', async (_event, filters) => {
  const file = await getFilePath([filters])
  if (file) {
    return readXlsxFile(file)
      .then((rows) => rows)
      .catch(console.error)
  }
})

ipcMain.handle('read-file-buffer', async (_, filePath) => fs.readFileSync(filePath))

ipcMain.handle('read-b64-file', async (_, filePath) => fs.readFileSync(filePath).toString('base64'))

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})

if (!isDev) {
  autoUpdater.on('download-progress', (progressObj) => {
    const progress = `Downloading Update - ${progressObj.percent.toFixed(2)}%`
    win.webContents.send('message', progress)
  })

  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateDownloaded', info)
  })
}
