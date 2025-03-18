import { NextRequest, NextResponse } from 'next/server'
import PDFParser from 'pdf2json'
import { Detalle } from '@/config/interfaces'

// const gptKey = process.env.OPENAIKEY
// const gptUrl = `https://api.openai.com/v1/chat/completions`

export const POST = async (req: NextRequest) => {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    if (!file) {
        return NextResponse.json({ error: 'No File provided' }, { status: 400 })
    }

    const pdfParser = new PDFParser()

    const parsedData = await new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            try {
                const table = extractTableFromPdf(pdfData)
                const parsed = extractTable(table)
                const products = processTable(parsed)
                resolve(products)
            } catch (error) {
                reject(error)
            }
        })

        pdfParser.on('pdfParser_dataError', (err) => {
            reject(err)
        })

        pdfParser.parseBuffer(fileBuffer)
    })

    return NextResponse.json(parsedData)
}

const extractTableFromPdf = (pdfData: any) => {
    const table: string[][] = []

    if (!pdfData.Pages || pdfData.Pages.length === 0) {
        return []
    }

    const page = pdfData.Pages[0] // Tomamos solo la primera página, puedes recorrer más si es necesario.
    const texts = page.Texts

    // Ordenamos los textos por su posición en `y` (de arriba a abajo) y `x` (de izquierda a derecha)
    texts.sort((a: any, b: any) => a.y - b.y || a.x - b.x)

    let currentRowY: number | null = null
    let currentRow: string[] = []

    texts.forEach((text: any) => {
        const decodedText = decodeURIComponent(text.R[0].T) // Decodifica el texto (%20 -> espacio)

        if (currentRowY === null) {
            currentRowY = text.y
        }

        // Si la diferencia en `y` es grande, significa que es una nueva fila
        if (currentRowY) {
            if (Math.abs(text.y - currentRowY) > 0.5) {
                table.push(currentRow)
                currentRow = []
                currentRowY = text.y
            }
        }

        currentRow.push(decodedText)
    })

    // Agregar última fila si no está vacía
    if (currentRow.length > 0) {
        table.push(currentRow)
    }

    return table
}

const extractTable = (rows: string[][]): string[][] => {
    let startIndex = -1
    const table: string[][] = []

    // Buscar la fila de encabezado de la tabla
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes('Cantidad') && rows[i].includes('Código') && rows[i].includes('Descripción')) {
            startIndex = i
            break
        }
    }

    if (startIndex === -1) {
        console.warn('No se encontró la cabecera de la tabla.')
        return table
    }

    // Extraer filas de la tabla hasta que se encuentre una fila que no cumpla el criterio
    for (let j = startIndex; j < rows.length; j++) {
        // Si la fila tiene menos de 8 columnas, se asume que ya terminó la tabla
        if (rows[j].length < 8) break
        table.push(rows[j])
    }

    return table
}

interface TableProduct {
    cantidad: number
    codigo: string
    descripcion: string
    talla: string | null
    color: string | null
    precio_unitario: number
    descuento: string
    total: number
}

const processTable = (table: string[][]): Detalle[] => {
    const newProducts: Detalle[] = []
    for (let i = 1; i < table.length; i++) {
        const row = table[i]
        const precio = parseFormattedNumber(row[5]) * 1.8
        const newProduct: Detalle = {
            CdgItem: {
                VlrCodigo: row[1],
                TpoCodigo: '',
            },
            MontoItem: '',
            NmbItem: `${row[2]} - ${row[3] || ''}`,
            NroLinDet: '',
            PrcItem: precio.toString(),
            PrcRef: '',
            QtyItem: row[0],
            UnmdItem: '',
        }

        newProducts.push(newProduct)
    }

    return newProducts
}

function parseFormattedNumber(input: string): number {
    // Removemos cualquier separador de miles (puntos o comas), dejando solo los dígitos
    const cleaned = input.replace(/[\.,]/g, '')
    return parseInt(cleaned, 10)
}
// const body = {
//     model: 'gpt-4o',
//     messages: [
//         {
//             role: 'user',
//             content: [
//                 {
//                     type: 'text',
//                     text: '"La imagen muestra una factura electrónica que registra una compra de diversos artículos. Se detallan cantidades, códigos, descripciones, tallas, colores, precios unitarios y totales. Debes extraer el detalle de cada producto sin equivocaciones"',
//                 },
//                 {
//                     type: 'image_url',
//                     image_url: {
//                         url,
//                     },
//                 },
//             ],
//         },
//     ],
//     tools: [
//         {
//             type: 'function',
//             function: {
//                 name: 'extractInvoiceData',
//                 description: 'Extrae los datos de una factura electrónica en formato JSON Array',
//                 parameters: {
//                     type: 'object',
//                     properties: {
//                         productos: {
//                             type: 'array',
//                             description: 'Arreglo de objetos que representan productos comprados',
//                             items: {
//                                 type: 'object',
//                                 properties: {
//                                     cantidad: { type: 'number' },
//                                     codigo: { type: 'string' },
//                                     descripcion: { type: 'string' },
//                                     talla: { type: ['string', 'null'] },
//                                     color: { type: ['string', 'null'] },
//                                     precio_unitario: { type: 'string' },
//                                     total: { type: 'string' },
//                                 },
//                             },
//                         },
//                     },
//                     required: ['cantidad', 'codigo', 'descripcion', 'talla', 'color', 'precio_unitario', 'total'],
//                 },
//             },
//         },
//     ],
//     tool_choice: 'auto',
// }
// const res = await fetch(gptUrl, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${gptKey}`,
//     },
//     body: JSON.stringify(body),
// })
// const data = await res.json()
// const arrProds = data.choices[0].message?.tool_calls?.[0]?.function?.arguments
// if (arrProds) {
//     return NextResponse.json(JSON.parse(arrProds))
// }
