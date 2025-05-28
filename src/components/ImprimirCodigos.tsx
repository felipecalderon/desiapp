import printJS from 'print-js'
import Barcode from './CodigodebarraCard'
import { BarcodeItem } from './CodigodebarraCard'

const items: BarcodeItem[] = [
    {
        title: 'Producto 1',
        sku: '1234567890123',
        subtitle: 'Descripción del producto 1',
    },
    {
        title: 'Producto 2',
        sku: '9876543210987',
        subtitle: 'Descripción del producto 2',
    },
]

export default function ImprimirCodigos() {
    const handlePrint = () => {
        printJS({
            printable: 'barcodes-container',
            type: 'html',
            targetStyles: ['*'],
        })
    }

    return (
        <>
            <button onClick={handlePrint}>Imprimir</button>
            <div id="barcodes-container">
                {items.map((item) => (
                    <Barcode key={item.sku} item={item} />
                ))}
            </div>
        </>
    )
}
