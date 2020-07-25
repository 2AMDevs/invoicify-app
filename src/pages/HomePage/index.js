import './index.scss'
import React, { useState } from 'react'

import { Stack } from 'office-ui-fabric-react/lib/Stack'

import { Invoice } from '../../components'

const deviceWidth = document.documentElement.clientWidth
const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.07 },
  styles: { root: { width: deviceWidth * 0.9 } },
}

const HomePage = () => {
  const [preview, setPreview] = useState('')

  return (
    <div
      className="home-page"
    >
      <Stack
        horizontal
        {...columnProps}
      >
        <Invoice
          setPreview={setPreview}
        />
        {preview?.length
          ? (
            <webview
              src={preview}
            />
          ) : (
            <div className="preview-area">
              <div>Invoice Preview</div>
            </div>
          )}
      </Stack>
    </div>
  )
}

export default HomePage
