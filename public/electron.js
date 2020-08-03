const fs = require('fs')
const path = require('path')

const {
  app, BrowserWindow, Menu, screen, ipcMain, dialog,
} = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

const { print } = require('./printPdf')

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
    height,
    width,
    resizable: false,
    frame: false,
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
ipcMain.on('print-it', (event, pdfBytes) => {
  event.preventDefault()
  print(pdfBytes)
})

ipcMain.on('bye-bye', () => {
  win.close()
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() })
})

ipcMain.handle('select-file', async () => {
  const file = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (file) {
    return file.filePaths[0]
  }
})

ipcMain.handle('read-pdf', async (_, filePath) => fs.readFileSync(filePath))

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})

if (!isDev) {
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('updateDownloaded')
  })
}
