import React, { useState, useEffect } from 'react'

import cn from 'classnames'
import { Icon } from 'office-ui-fabric-react'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Document, Page } from 'react-pdf'

import { getPdf } from '../../../services/pdfService'
import { defaultPageSettings, PREVIEW } from '../../../utils/constants'
import './index.scss'

const scale = 0.75
const offsets = {
  x: 8,
  y: defaultPageSettings.height - 66,
}

const RightPanel = ({ selectedItem, idx, handleChange }) => {
  const [pos, setPos] = useState({ x: 0, y: 0, changeRoot: false })
  const [pdfData, setPdfBytes] = useState('')

  const previewPDF = () => {
    getPdf({}, PREVIEW)
      .then((pdfBytes) => {
        if (pdfBytes?.error) {
          return
        }
        setPdfBytes(pdfBytes)
      })
  }

  useEffect(() => {
    previewPDF()
  }, [])

  const heightDragHandle = selectedItem?.size ?? 30
  const widthDragHandle = 60

  useEffect(() => {
    setPos({
      x: selectedItem ? (selectedItem.x * scale) - offsets.x : 0,
      y: selectedItem ? ((offsets.y - selectedItem.y) * scale) : 0,
      changeRoot: false,
    })
  }, [selectedItem, idx])

  useEffect(() => {
    if (idx !== undefined && pos.changeRoot) {
      handleChange(idx, 'x', offsets.x + (pos.x / scale))
      handleChange(idx, 'y', (offsets.y - (pos.y / scale)))
    }
    // eslint-disable-next-line
  }, [pos])

  const dragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = (e) => {
    const rect = document.getElementById('drop-target').getBoundingClientRect()
    const posX = e.clientX - rect.left
    const posY = e.clientY - rect.top - (heightDragHandle / 2)
    const x = posX < 0 ? 0 : posX
    const y = posY < 0 ? 0 : posY
    setPos({
      x: Math.min(x, rect.width - widthDragHandle),
      y: Math.min(y, rect.height - heightDragHandle),
      changeRoot: true,
    })
  }

  return (
    <div
      className={cn('right-panel', {
        'right-panel--active': selectedItem,
      })}
    >
      <h1 className="right-panel__header">
        Set position of the Field on invoice
      </h1>
      <div
        className="right-panel__preview"
        id="drop-target"
        onDragOver={dragOver}
      >
        {pdfData?.length > 0 && (
          <Document
            file={{ data: pdfData }}
            loading={(
              <Spinner
                size={SpinnerSize.large}
                styles={{ verticalAlign: 'center' }}
              />
            )}
          >
            <Page
              pageNumber={1}
              scale={scale}
            />
          </Document>
        )}
        <div
          className="right-panel__preview__handle"
          draggable
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            width: `${widthDragHandle}px`,
            height: `${heightDragHandle}px`,
          }}
          id="drag-target"
          role="presentation"
          onDragEnd={handleDragEnd}
        >
          <Icon
            className="right-panel__preview__handle--icn"
            iconName="DragObject"
          />
        </div>
      </div>
    </div>
  )
}

export default RightPanel
