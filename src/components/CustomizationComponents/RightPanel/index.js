import React, { useState } from 'react'

import cn from 'classnames'

import './index.scss'

const RightPanel = ({ selectedItem }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })

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
      >
        <div
          className="right-panel__preview__handle"
          draggable
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
          }}
          id="drag-target"
          role="presentation"
          onDragEnd={(e) => {
            const rect = document.getElementById('drop-target').getBoundingClientRect()
            setPos({ x: e.clientX - rect.left - 60, y: e.clientY - rect.top - 10 })
          }}
        />
      </div>
    </div>
  )
}

export default RightPanel
