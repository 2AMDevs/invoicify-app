import React from 'react'

import cn from 'classnames'

import './index.scss'

const SideBar = ({ className, ...restProps }) => (
  <div
    className={cn('sidebar', className)}
    {...restProps}
  >
    sidebar
  </div>
)

export default SideBar
