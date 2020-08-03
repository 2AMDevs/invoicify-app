import React from 'react'

import { FontIcon } from 'office-ui-fabric-react/lib/Icon'

const ListEmpty = ({ type, source }) => (
  <div className="invoice-item-table__no-items">
    <FontIcon
      iconName="GiftboxOpen"
      className="invoice-item-table__no-items_icon"
    />
    <p className="invoice-item-table__no-items_text">{`No ${type} in ${source}`}</p>
  </div>
)

export default ListEmpty
