import { Stack } from 'office-ui-fabric-react/lib/Stack'
import React, { useState } from 'react'
import { Invoice } from '../../components'
import './index.scss'

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
            <iframe
              title="Invoice Preview"
              width="520px"
              height="554px"
              src={`data:application/pdf;base64,${preview}`}
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
