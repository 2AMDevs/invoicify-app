const fs = require('fs')
const os = require('os')
const path = require('path')

const PDFWindow = require('electron-pdf-window')

const print = (pdfBytes) => {
  fs.writeFile(path.join(os.tmpdir(), 'print.pdf'), pdfBytes, () => {})
  const win = new PDFWindow({ show: true, plugins: true })

  const pdfPath = encodeURIComponent(`file://${os.tmpdir()}/print.pdf`)
  win.loadURL(pdfPath)

  win.webContents.once('dom-ready', () => {
    setTimeout(() => {
      const code = 'document.getElementById(\'print\').dispatchEvent(new Event(\'click\'));'
      win.webContents.executeJavaScript(code)
    }, 3000)
  })
}

module.exports = {
  print,
}
