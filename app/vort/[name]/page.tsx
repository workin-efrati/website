import React from 'react'
import PDFViewer from '@/components/pdf-viewer'
import HeaderPlaceholder from '@/components/header-placeholder'

export default function Vort() {
  return (
    <>
    <HeaderPlaceholder/>
    <div>
        <PDFViewer pdfUrl="/pdf/example.pdf" />
    </div>
    </>
  )
}
