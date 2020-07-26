import './index.scss'
import React, { useState } from 'react'

import { Stack } from 'office-ui-fabric-react/lib/Stack'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { useConstCallback } from '@uifabric/react-hooks'
import { pdfjs, Document, Page } from 'react-pdf'

import { Invoice } from '../../components'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const deviceWidth = document.documentElement.clientWidth
const columnProps = {
  tokens: { childrenGap: deviceWidth * 0.07 },
  styles: { root: { width: deviceWidth * 0.9 } },
}

const HomePage = () => {
  const [preview, setPreview] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const showPdfPreview = (pdfBytes) => {
    setPreview(pdfBytes)
    setIsPreviewOpen(true)
  }

  return (
    <div
      className="home-page"
    >
      <Stack
        horizontal
        {...columnProps}
      >
        <Invoice
          showPdfPreview={showPdfPreview}
        />
        <Panel
          isLightDismiss
          className="home-page__panel"
          isOpen={isPreviewOpen}
          onDismiss={() => {
            setIsPreviewOpen(false)
          }}
          closeButtonAriaLabel="Close"
          headerText="Invoice preview"
        >
          {preview?.length
            ? (
              <Document
                file={{ data: preview }}
              >
                <Page
                  pageNumber={1}
                  scale={0.65}
                />
              </Document>
            ) : (
              <div className="preview-area">
                <div>Invoice Preview</div>
              </div>
            )}
        </Panel>
      </Stack>
    </div>
  )
}

export default HomePage
