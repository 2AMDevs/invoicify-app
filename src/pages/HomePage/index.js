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

  const openPreviewPanel = useConstCallback(() => setIsPreviewOpen(true))

  const dismissPreviewPanel = useConstCallback(() => setIsPreviewOpen(false))

  const showPdfPreview = (pdfBytes) => {
    setPreview(pdfBytes)
    openPreviewPanel()
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
        className="home-page__preview-panel"
        isOpen={isPreviewOpen}
        onDismiss={dismissPreviewPanel}
        closeButtonAriaLabel="Close"
        headerText="Invoice preview"
      >
        {preview?.length
          ? (
            <Document
              file={{ data: preview }}
              className="home-page__preview-panel__doc"
            >
              <Page
                pageNumber={1}
                scale={0.75}
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
