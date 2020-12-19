import React, { useState } from 'react'

import { useBoolean, useId } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog'
import { DirectionalHint, TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'

import { SELECT_FILE_TYPE } from '../../utils/constants'
import { setProducts } from '../../utils/helper'
import { generateUuid4 } from '../../utils/utils'
import './index.scss'

const dialogContentProps = {
  type: DialogType.normal,
  title: 'Save new Products?',
  closeButtonAriaLabel: 'Close',
  subText: 'Do you want to append new products or replace current products?',
}

const ImportProducts = ({ refreshProductItems }) => {
  const [newProducts, setNewProducts] = useState([])

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)

  const labelId = useId('dialogLabel')

  const subTextId = useId('subTextLabel')

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: true,
    }),
    [labelId, subTextId],
  )

  const handleImportBtnClick = () => {
    // eslint-disable-next-line global-require
    const { ipcRenderer } = require('electron')
    ipcRenderer.invoke('products-excel-to-json', SELECT_FILE_TYPE.EXCEL).then((res) => {
      const newLocalProducts = res?.map((item) => ({
        name: item[0],
        type: item[1],
        price: item[2],
        id: generateUuid4(),
      }))
      if (newLocalProducts?.length) {
        setNewProducts(newLocalProducts)
        toggleHideDialog()
      }
    // eslint-disable-next-line no-console
    }).catch(console.error)
  }

  const saveNewProducts = (replace) => {
    setProducts([...newProducts], replace)
    setNewProducts([])
    toggleHideDialog()
    if (refreshProductItems) refreshProductItems()
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
          iconProps={{ iconName: 'ExcelLogoInverse' }}
          text="Import"
          checked={false}
          onClick={handleImportBtnClick}
        />
      </TooltipHost>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => saveNewProducts()}
            text="Append"
          />
          <DefaultButton
            onClick={() => saveNewProducts(true)}
            text="Replace"
          />
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default ImportProducts
