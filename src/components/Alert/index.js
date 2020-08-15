import * as React from 'react'

import { useId } from '@uifabric/react-hooks'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'

const dialogStyles = { main: { maxWidth: 450 } }

const Alert = ({
  hide, title, subText, setHideAlert,
}) => {
  const labelId = useId('dialogLabel')
  const subTextId = useId('subTextLabel')

  const dialogContentProps = {
    title,
    subText,
    type: DialogType.largeHeader,
  }

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
    }),
    [labelId, subTextId],
  )

  return (
    <Dialog
      hidden={hide}
      onDismiss={() => setHideAlert(!hide)}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <DialogFooter>
        <PrimaryButton
          onClick={() => setHideAlert(!hide)}
          text="Okie Dokie"
        />
      </DialogFooter>
    </Dialog>
  )
}

export default Alert
