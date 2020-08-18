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
  try {
    await ptp.print(filePath, { printer })
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  print,
  getPrinters,
  getDefaultPrinter,
}
