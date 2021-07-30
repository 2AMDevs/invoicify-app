import React from 'react'

import cn from 'classnames'

import './index.scss'

const RightPanel = ({ selectedItem }) => (
  <div
    className={cn('right-panel', {
      'right-panel--active': selectedItem,
    })}
  >
    <h1 className="right-panel__header">Set position of the Field on invoice</h1>
    <div className="right-panel__preview" />
  </div>
)

export default RightPanel
