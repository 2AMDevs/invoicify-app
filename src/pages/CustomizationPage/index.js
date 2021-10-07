import React, { useState } from 'react'

import { LeftPanel, MiddleSection, RightPanel } from '../../components'
import { getInvoiceSettings } from '../../services/settingsService'
import { ISET } from '../../utils/constants'

import './index.scss'

const CustomizationPage = () => {
  const [selectedItem, setSelectedItem] = useState()
  const [selectedItemIdx, setSelectedItemIdx] = useState()
  // eslint-disable-next-line no-unused-vars
  const [currentSettings, setCurrentSettings] = useState(getInvoiceSettings())
  const [printSettings, setPrintSettings] = useState(getInvoiceSettings(ISET.PRINT))
  const [calcSettings, setCalcSettings] = useState(getInvoiceSettings(ISET.CALC))
  const [footerPrintSettings, setFooterPrintSettings] = useState(getInvoiceSettings(ISET.FOOTER))

  const getNewSettings = (type) => {
    if (type === ISET.PRINT) return { ...printSettings }
    if (type === ISET.CALC) return { ...calcSettings }
    if (type === ISET.FOOTER) return { ...footerPrintSettings }
    return [...currentSettings]
  }

  const handleChange = (index, key, value, type = ISET.MAIN) => {
    const newSettings = getNewSettings(type)

    if (type !== ISET.MAIN) {
      newSettings[key] = value
      if (type === ISET.PRINT) {
        setPrintSettings(newSettings)
      } else if (type === ISET.CALC) {
        setCalcSettings(newSettings)
      } else if (type === ISET.FOOTER) {
        setFooterPrintSettings(newSettings)
      }
    } else {
      newSettings[index][key] = value
      setCurrentSettings(newSettings)
    }
    localStorage.setItem(type, JSON.stringify(newSettings))
  }

  const onSelect = (item, idx) => {
    setSelectedItem(item)
    setSelectedItemIdx(idx)
  }

  return (
    <div className="customization-page">
      <LeftPanel
        items={currentSettings}
        selectedItem={selectedItem}
        setSelectedItem={onSelect}
      />
      <MiddleSection
        setting={selectedItem}
        idx={selectedItemIdx}
        handleChange={handleChange}
      />
      <RightPanel
        selectedItem={selectedItem}
        idx={selectedItemIdx}
        handleChange={handleChange}
      />
    </div>
  )
}

export default CustomizationPage
