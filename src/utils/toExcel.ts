import { Producto, Variacion } from '@/config/interfaces'
import * as XLSX from 'xlsx'
import { calcularEAN } from './calcEan13'

interface JSONfromExcel {
    cantidad: string
    item: string
    ivacompra: number
    ivaventa: number
    marca: string
    markup: number
    modelo: string
    netocompra: string
    netoventa: number
    precioplaza: number
    sku: string
    talla: string
    totalcompra: number
}

export const bajarExcel = (productos: Producto[]): void => {
    if (!productos || productos.length === 0) {
        console.log('No hay productos para descargar Excel')
        return
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    const ws: XLSX.WorkSheet = {}

    const headers: string[] = [
        'tipo',
        'nombre',
        'variacion',
        'marca',
        'permite decimal',
        'codigo de barras',
        'sku',
        'stock',
        'costo neto',
        'precio unitario',
    ]

    // Agregar los encabezados a la primera fila
    headers.forEach((header, colIdx) => {
        const cell_ref: string = XLSX.utils.encode_cell({ c: colIdx, r: 0 })
        ws[cell_ref] = { t: 's', v: header }
    })

    let filaActual = 1
    // Agregar los datos de los productos
    productos.forEach((producto) => {
        producto.ProductVariations.forEach((variacion: Variacion) => {
            const values = [
                'Zapatilla',
                producto.name,
                variacion.sizeNumber,
                'D3SI AVOCCO',
                'Si',
                calcularEAN(variacion.sku),
                variacion.sku,
                variacion.stockQuantity,
                Math.round(variacion.priceCost),
                Math.round(variacion.priceList),
            ]
            values.forEach((value, colIdx) => {
                const cell_ref: string = XLSX.utils.encode_cell({
                    c: colIdx,
                    r: filaActual,
                })
                ws[cell_ref] = {
                    t: typeof value === 'number' ? 'n' : 's',
                    v: value,
                }
            })
            filaActual++
        })
    })

    let range: XLSX.Range = {
        s: { c: 0, r: 0 },
        e: { c: headers.length - 1, r: filaActual },
    }

    ws['!ref'] = XLSX.utils.encode_range(range)

    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1')
    XLSX.writeFile(wb, `tabla-stock-d3si.xlsx`)
}

export const excelTOJSON = (file: File): Promise<JSONfromExcel[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })

                // Obtener la primera hoja
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]

                // Convertir a JSON con normalización de claves
                const rawJson = XLSX.utils.sheet_to_json(sheet, { defval: '' })

                // Normalizar nombres de propiedades eliminando espacios
                const normalizedJson: JSONfromExcel[] = rawJson.map((row: any) => {
                    const newRow: any = {}
                    Object.keys(row).forEach((key) => {
                        const normalizedKey = key.replace(/\s+/g, '').toLowerCase() // Elimina espacios y pone en minúsculas
                        newRow[normalizedKey] = row[key]
                    })
                    return newRow
                })

                resolve(normalizedJson.filter((row) => row.item !== ''))
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = (error) => reject(error)
        reader.readAsArrayBuffer(file)
    })
}
