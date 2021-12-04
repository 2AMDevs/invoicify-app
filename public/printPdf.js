/* eslint-disable no-console */
const fs = require('fs')
const os = require('os')
const path = require('path')

const ptp = process.platform === 'win32'
  ? require('pdf-to-printer')
  : require('unix-print')

/**
 * returns list of printers present on device
 */
const getPrinters = async () => ptp.getPrinters()

/**
 * returns default printer
 */
const getDefaultPrinter = async () => ptp.getDefaultPrinter()

/**
 * Print pdfBytes with selectedPrinter
 * @param {Uint8Array} pdfBytes PDF Content in Uint8 format
 * @param {string} selectedPrinter Name of Printer selected
 * @returns {boolean} true if printed successfully else false
 */
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
