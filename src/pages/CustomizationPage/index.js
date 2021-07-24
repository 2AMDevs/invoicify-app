import React, { useState } from 'react'

import cn from 'classnames'

import './index.scss'

const items = [
  { key: '0', name: 'Invoice Number' },
  { key: '1', name: 'Invoice Date' },
  { key: '2', name: 'Another item' },
  { key: '3', name: 'Address' },
  { key: '4', name: 'Customer Name' },
  { key: '5', name: 'Mobile No.' },
  { key: '6', name: 'Must field' },
  { key: '7', name: 'Hidden Field' },
]

const CustomizationPage = () => {
  const [selectedItem, setSelectedItem] = useState()

  return (
    <div className="customization-page">
      <div className="customization-page__fields-list">
        <ul>
          {items.map((item) => (
            <button
              className="customization-page__fields-list__item"
              key={item.key}
              title={item.name}
              type="button"
              onClick={() => setSelectedItem((prevSelectedItem) => !prevSelectedItem && item)}
            >
              <p>{item.name}</p>
            </button>
          ))}
        </ul>
      </div>
      <div className="customization-page__settings">
        field options
      </div>
      <div
        className={cn('customization-page__preview', {
          'customization-page__preview--active': selectedItem,
        })}
      >
        preview pan
      </div>
    </div>
  )
}

export default CustomizationPage
