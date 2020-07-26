import './index.scss'
import React, { useState } from 'react'

import { useConstCallback } from '@uifabric/react-hooks'
import { CommandBarButton } from 'office-ui-fabric-react'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { pdfjs, Document, Page } from 'react-pdf'

import { Invoice } from '../../components'
import ProductsPage from '../ProductsPage'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const HomePage = () => {
  const [preview, setPreview] = useState('')

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const openPreviewPanel = useConstCallback(() => setIsPreviewOpen(true))

  const dismissPreviewPanel = useConstCallback(() => setIsPreviewOpen(false))

  const openProductsPanel = useConstCallback(() => setIsProductsOpen(true))

  const dismissProductsPanel = useConstCallback(() => setIsProductsOpen(false))

  const showPdfPreview = (pdfBytes) => {
    setPreview(pdfBytes)
    openPreviewPanel()
  }

  return (
    <div
      className="home-page"
    >
      <CommandBarButton
        className="home-page__products-btn"
        iconProps={{ iconName: 'ProductVariant' }}
        text="Products"
        checked={false}
        onClick={openProductsPanel}
      />
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
      <Panel
        isLightDismiss
        className="home-page__products-panel"
        headerClassName="home-page__products-panel__header"
        isOpen={isProductsOpen}
        onDismiss={dismissProductsPanel}
        closeButtonAriaLabel="Close"
        headerText="Products"
      >
        <ProductsPage />
      </Panel>
    </div>
  )
}

export default HomePage
