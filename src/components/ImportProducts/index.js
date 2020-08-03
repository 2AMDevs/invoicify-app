import React from 'react'

import { CommandBarButton } from 'office-ui-fabric-react'
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip'

import './index.scss'

const ImportProducts = () => {
  const handleImportBtnClick = () => {
    // eslint-disable-next-line global-require
    const { ipcRenderer } = require('electron')
    ipcRenderer.invoke('products-excel-to-json').then((res) => console.log(res))
      .catch((e) => console.error(e))
  }

  return (
    <div className="import-products">
      <TooltipHost
        content="Import from a excel file."
        closeDelay={500}
        directionalHint={DirectionalHint.bottomCenter}
        id="importBtn"
      >
        <CommandBarButton
          aria-describedby="importBtn"
          className="import-products__btn"
          iconProps={{ iconName: 'Import' }}
          text="Import from excel"
          checked={false}
          onClick={handleImportBtnClick}
        />
      </TooltipHost>
    </div>
  )
}

export default ImportProducts
