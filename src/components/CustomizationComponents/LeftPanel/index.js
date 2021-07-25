import React from 'react'

import './index.scss'

const LeftPanel = ({ items, setSelectedItem }) => (
  <div className="left-panel">
    <ul>
      {items.map((item) => (
        <button
          className="left-panel__item"
          key={item.name}
          title={item.name}
          type="button"
          onClick={() => setSelectedItem((prevSelectedItem) => !prevSelectedItem && item)}
        >
          <p>{item.name}</p>
        </button>
      ))}
    </ul>
  </div>
)

export default LeftPanel
