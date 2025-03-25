'use client'
import { useState } from 'react'
import { Document, Page } from '@react-pdf/renderer'

const PDFView = ({ url }: { url: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null)
    const pdf = new Array(numPages)

    return (
        <Document>
            {Array.from(pdf, (el, index) => (
                <Page key={`page_${index + 1}`} />
            ))}
        </Document>
    )
}

export default PDFView
