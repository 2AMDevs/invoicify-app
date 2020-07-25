/* eslint-disable no-console */
const fs = require('fs')
const os = require('os')
const path = require('path')

const ptp = require('pdf-to-printer')

const print = (pdfBytes) => {
  const filePath = path.join(os.tmpdir(), 'print.pdf')
  fs.writeFile(filePath, pdfBytes, () => {})
  ptp
    .print(filePath, { win32: ['-print-settings "2x"'] })
    .then(console.log)
    .catch(console.error)
}

module.exports = {
  print,
}
