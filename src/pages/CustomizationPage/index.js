import React, { useState } from 'react'

import { LeftPanel, RightPanel } from '../../components'
import { getInvoiceSettings } from '../../services/settingsService'
// import { ISET } from '../../utils/constants'

import './index.scss'

const CustomizationPage = () => {
  const [selectedItem, setSelectedItem] = useState()
  // eslint-disable-next-line no-unused-vars
  const [currentSettings, setCurrentSettings] = useState(getInvoiceSettings())
  // const [printSettings, setPrintSettings] = useState(getInvoiceSettings(ISET.PRINT))
  // const [calcSettings, setCalcSettings] = useState(getInvoiceSettings(ISET.CALC))
  // const [footerPrintSettings, setFooterPrintSettings] = useState(getInvoiceSettings(ISET.FOOTER))

  // console.log(calcSettings)

  return (
    <div className="customization-page">
      <LeftPanel
        items={currentSettings}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <div className="customization-page__settings">
        field options
      </div>
      <RightPanel
        selectedItem={selectedItem}
      />
    </div>
  )
}

export default CustomizationPage
