const fs = require('fs')
const path = require('path')

const {
  BrowserWindow,
} = require('electron')

const print = (pdfBytes) => {
  const win = new BrowserWindow({ show: true, plugins: true })
  fs.writeFile(path.join(__dirname, 'print.pdf'), pdfBytes, () => {})
  win.loadURL(`file://${__dirname}/print.pdf`)
  win.webContents.on('did-finish-load', () => {
    win.webContents.print({ silent: true })
    setTimeout(() => {
      win.close()
    }, 1000)
  })
}

module.exports = {
  print,
}
