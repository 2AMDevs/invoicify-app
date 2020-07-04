import React from 'react'

import cn from 'classnames'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { CommandBarButton } from 'office-ui-fabric-react'
import { useBoolean } from '@uifabric/react-hooks'

import './index.scss'

const SideBar = ({ className, ...restProps }) => {
  const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false)
  const exampleSecondaryButtonProps = React.useMemo(
    () => ({
      children: 'Maybe later',
      onClick: toggleTeachingBubbleVisible,
    }),
    [toggleTeachingBubbleVisible],
  )

  return (
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
        id="targetButton"
        onClick={toggleTeachingBubbleVisible}
        className="sidebar__btn"
        iconProps={{ iconName: 'print' }}
        text="Print"
        disabled={false}
        checked={false}
      />

      {teachingBubbleVisible && (
        <TeachingBubble
          target="#targetButton"
          primaryButtonProps={{
            children: 'Try it out',
          }}
          secondaryButtonProps={exampleSecondaryButtonProps}
          onDismiss={toggleTeachingBubbleVisible}
          headline="Magical feature to print a doc"
        >
          You can print doc by clicking this button
        </TeachingBubble>
      )}
    </div>
  )
}

export default SideBar
