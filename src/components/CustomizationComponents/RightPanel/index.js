import React from 'react'

import cn from 'classnames'

import './index.scss'

const RightPanel = ({ selectedItem }) => (
  <div
    className={cn('right-panel', {
      'right-panel--active': selectedItem,
    })}
  >
    Right panel
  </div>
)

export default RightPanel
