import './index.scss'
import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { pdfjs, Document, Page } from 'react-pdf'

import { Invoice } from '../../components'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const HomePage = () => {
  const [preview, setPreview] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const openPanel = useConstCallback(() => setIsPreviewOpen(true))
  const dismissPanel = useConstCallback(() => setIsPreviewOpen(false))

  const showPdfPreview = (pdfBytes) => {
    setPreview(pdfBytes)
    openPanel()
  }

  return (
    <div
      className="home-page"
    >
      <Invoice
        showPdfPreview={showPdfPreview}
      />
      <Panel
        isLightDismiss
        className="home-page__preiew-panel"
        isOpen={isPreviewOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        headerText="Invoice preview"
      >
        {preview?.length
          ? (
            <Document
              file={{ data: preview }}
              className="home-page__preiew-panel__doc"
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
    </div>
  )
}

export default HomePage
