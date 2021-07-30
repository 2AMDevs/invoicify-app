import React, { useState } from 'react'

import cn from 'classnames'

import './index.scss'

const RightPanel = ({ selectedItem }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  return (
    <div
      className={cn('right-panel', {
        'right-panel--active': selectedItem,
      })}
    >
      <h1 className="right-panel__header">Set position of the Field on invoice</h1>
      <div
        className="right-panel__preview"
        onMouseMove={(e) => {
          if (!dragging) return

          const rect = e.target.getBoundingClientRect()
          setPos({ x: e.clientX - rect.left - 15, y: e.clientY - rect.top - 15 })
        }}
      >
        <div
          className="right-panel__preview__handle"
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            // pointerEvents: dragging ? 'none' : 'all',
          }}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          role="presentation"
        />
      </div>
    </div>
  )
}

export default RightPanel
