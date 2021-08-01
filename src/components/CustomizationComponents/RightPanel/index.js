import React, { useState, useEffect } from 'react'

import cn from 'classnames'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Document, Page } from 'react-pdf'

import { getFromStorage } from '../../../services/dbService'

import './index.scss'

const RightPanel = ({ selectedItem }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setPos({
      x: selectedItem ? selectedItem.x : 0,
      y: selectedItem ? selectedItem.y : 0,
    })
  }, [selectedItem])

  const heightDragHandle = 40
  const widthDragHandle = 130

  const dragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = (e) => {
    const rect = document.getElementById('drop-target').getBoundingClientRect()
    const posX = e.clientX - rect.left - (widthDragHandle / 2)
    const posY = e.clientY - rect.top - (heightDragHandle / 2)
    const x = posX < 0 ? 0 : posX
    const y = posY < 0 ? 0 : posY
    setPos({
      x: Math.min(x, rect.width - widthDragHandle),
      y: Math.min(y, rect.height - heightDragHandle),
    })
  }

  return (
    <div
      className={cn('right-panel', {
        'right-panel--active': selectedItem,
      })}
    >
      <h1 className="right-panel__header">Set position of the Field on invoice</h1>
      <div
        className="right-panel__preview"
        id="drop-target"
        onDragOver={dragOver}
      >
        <Document
          file={getFromStorage('previewPDFUrl')}
          loading={(
            <Spinner
              size={SpinnerSize.large}
              styles={{ verticalAlign: 'center' }}
            />
          )}
        >
          <Page
            pageNumber={1}
            scale={0.75}
          />
        </Document>
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
        />
      </div>
    </div>
  )
}

export default RightPanel
