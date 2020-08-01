import './index.scss'
import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Document, Page } from 'react-pdf'

import { Invoice } from '../../components'

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
              onLoadError={console.error}
              onSourceError={console.error}
              onRenderError={console.error}
              loading={(
                <Spinner
                  size={SpinnerSize.large}
                  styles={{ verticalAlign: 'center' }}
                />
              )}
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
