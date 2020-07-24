const fs = require('fs')
const path = require('path')

const PDFWindow = require('electron-pdf-window')

// const {
//   BrowserWindow,
// } = require('electron')

const print = (pdfBytes) => {
  // const win = new BrowserWindow({ show: true, plugins: true })
  fs.writeFile(path.join(__dirname, 'print.pdf'), pdfBytes, () => {})
  const win = new PDFWindow({
    width: 800,
    height: 600,
  })

  // win.loadURL('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  win.loadURL(`file://${__dirname}/print.pdf`)
  // win.webContents.on('did-finish-load', () => {
  //   win.webContents.print({ silent: true })
  //   setTimeout(() => {
  //     win.close()
  //   }, 1000)
  // })
}

module.exports = {
  print,
}
