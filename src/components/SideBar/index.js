import React from 'react'

import cn from 'classnames'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { CommandBarButton } from 'office-ui-fabric-react'


import './index.scss'

const SideBar = ({ className, ...restProps }) => (
  <div
    className={cn('sidebar', className)}
    {...restProps}
  >
    <CommandBarButton
      className="sidebar__btn"
      iconProps={{ iconName: 'phone' }}
      text="Phone"
      disabled={false}
      checked={false}
    />

    <CommandBarButton
      className="sidebar__btn"
      iconProps={{ iconName: 'share' }}
      text="Share"
      disabled={false}
      checked={false}
    />

    <CommandBarButton
      className="sidebar__btn"
      iconProps={{ iconName: 'print' }}
      text="Print"
      disabled={false}
      checked={false}
    />
  </div>
)

export default SideBar
