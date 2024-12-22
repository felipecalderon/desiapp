'use client'
import { useState } from 'react';
import { Document, Page, } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFView = ({ url }: { url: string }) => {
        const [numPages, setNumPages] = useState<number | null>(null);
        const pdf = new Array(numPages)
        const onDocumentLoadSuccess = ({ numPages }: {numPages: number}) => {
            setNumPages(numPages);
        }
    
        return (
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(
                    pdf,
                    (el, index) => (
                        <Page 
                            className="mb-3 shadow-md"
                            key={`page_${index + 1}`} 
                            renderAnnotationLayer={false} 
                            renderTextLayer={false} 
                            pageNumber={index + 1} 
                        />
                    ),
                )}
            </Document>
        );
    }
    
    export default PDFView;