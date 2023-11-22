import { Document, Page, } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFView = ({ url }: { url: string }) => {
    // 'https://res.cloudinary.com/duwncbe8p/image/upload/v1700602362/me47uatqg1jndmv4bmfk.pdf'
    if(url) return (
        <Document file={url}>
            <Page pageNumber={1} />
        </Document>
    )
}

export default PDFView