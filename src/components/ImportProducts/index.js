import React, { useState } from 'react'

import { useId, useBoolean } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip'

import { generateUuid4, setProducts } from '../../utils/helper'

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
    ipcRenderer.invoke('products-excel-to-json').then((res) => {
      const newLocalProducts = res.map((item) => {
        const newItemId = generateUuid4()
        return {
          name: item[0],
          type: item[1],
          id: newItemId,
        }
      })
      setNewProducts(newLocalProducts)
      toggleHideDialog()
    }).catch((e) => console.error(e))
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
          iconProps={{ iconName: 'Import' }}
          text="Import from excel"
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
