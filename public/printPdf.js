/* eslint-disable no-console */
const fs = require('fs')
const os = require('os')
const path = require('path')

const ptp = require('pdf-to-printer')

const getPrinters = async () => ptp.getPrinters()
const getDefaultPrinter = async () => ptp.getDefaultPrinter()

const print = async (pdfBytes, selectedPrinter) => {
  const printer = selectedPrinter ?? await getDefaultPrinter()
  const filePath = path.join(os.tmpdir(), 'print.pdf')
  fs.writeFile(filePath, pdfBytes, () => {})
  ptp
    .print(filePath, { printer, win32: ['-print-settings "2x"'] })
    .then(console.log)
    .catch(console.error)
}

module.exports = {
  print,
  getPrinters,
  getDefaultPrinter,
}
