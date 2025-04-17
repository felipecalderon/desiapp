import { XMLBuilder } from 'fast-xml-parser'

const facturaJSON = {
    DTE: {
        Documento: {
            Encabezado: {
                IdDoc: {
                    TipoDTE: '33', // Factura Electrónica
                    Folio: '123',
                    FchEmis: '2025-04-10',
                },
                Emisor: {
                    RUTEmisor: '99999999-9',
                    RznSoc: 'Mi Empresa',
                },
                Receptor: {
                    RUTRecep: '11111111-1',
                    RznSocRecep: 'Cliente de prueba',
                },
                Totales: {
                    MntTotal: '1000',
                },
            },
            Detalle: [
                {
                    NroLinDet: '1',
                    NmbItem: 'Producto X',
                    QtyItem: '1',
                    PrcItem: '1000',
                },
            ],
        },
    },
}

const builderOptions = {
    format: true,
    indentBy: '  ',
    suppressEmptyNode: true,
}

const builder = new XMLBuilder(builderOptions)
export const xmlSinFirmar = builder.build(facturaJSON)
