const fs = require('fs')
const path = require('path')

const PDFWindow = require('electron-pdf-window')

const print = (pdfBytes) => {
  fs.writeFile(path.join(__dirname, 'print.pdf'), pdfBytes, () => {})
  const win = new PDFWindow({ show: true, plugins: true })

  const pdfPath = encodeURIComponent(`file://${__dirname}/print.pdf`)
  win.loadURL(pdfPath)
  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      win.webContents.print({ silent: true })
      // win.close()
    }, 1000)
  })
  win.openDevTools()
}

module.exports = {
  print,
}
