import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { Producto } from '@/config/interfaces'
import { formatoPrecio } from '@/utils/price'
import { CotizacionProps, Images } from '@/stores/store.cotizacion'

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    companyInfo: {
        display: 'flex',
        flexDirection: 'column',
        width: '60%',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    logo: {
        width: 144,
        height: 64,
        objectFit: 'contain',
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0284c7', // similar a text-sky-800
        marginLeft: 6,
    },
    companyDetails: {
        fontSize: 8,
        textTransform: 'uppercase',
        lineHeight: 1.2,
    },
    quoteInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '35%',
        border: '2px solid red',
        padding: 6,
    },
    quoteInfoText: {
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
    section: {
        marginBottom: 12,
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ccc',
        breakInside: 'avoid',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#e2e8f0',
    },
    tableCell: {
        padding: 4,
        borderRight: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        fontSize: 8,
    },
    lastCell: {
        borderRight: 0,
    },
    // Estilos para cada columna
    cellItem: {
        flex: 2, // mayor ancho
    },
    cellModels: {
        flex: 2, // mayor ancho
    },
    cellQuantity: {
        flex: 1, // más estrecha
    },
    cellPrice: {
        flex: 1, // más estrecha
    },
    cellSubtotal: {
        flex: 1, // más estrecha
    },
    totalsTable: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 6,
    },
    totalsRow: {
        flexDirection: 'row',
    },
    totalsCell: {
        padding: 4,
        borderBottom: '1px solid #ccc',
        fontSize: 10,
    },
    horizontalImageContainer: {
        marginBottom: 10,
        breakInside: 'avoid',
    },
    horizontalImage: {
        width: '100%',
        height: 150,
        objectFit: 'cover',
    },
    gridImage: {
        width: '100%',
        height: 80,
        objectFit: 'cover',
    },
})

const MyPDFDocument = ({
    clientData,
    quoteItems,
    totals,
    horizontalImages,
    gridImages,
    companyInfo,
    bankInfo,
    facturaInfo,
}: CotizacionProps) => {
    const chunkArray = (arr: Images[], size: number) => {
        const chunked = []
        for (let i = 0; i < arr.length; i += size) {
            chunked.push(arr.slice(i, i + size))
        }
        return chunked
    }
    const gridRows = chunkArray(gridImages, 4)
    return (
        <Document>
            <Page size={[612, 1200]} style={styles.page}>
                {/* Encabezado */}
                <View style={styles.headerContainer}>
                    <View style={styles.companyInfo}>
                        <View style={styles.logoContainer}>
                            <Image src={facturaInfo.logoSrc} style={styles.logo} />
                            <Text style={styles.companyName}>{companyInfo.name}</Text>
                        </View>
                        <View style={styles.companyDetails}>
                            <Text>VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS</Text>
                            <Text>{companyInfo.address}</Text>
                            <Text>{companyInfo.email}</Text>
                        </View>
                    </View>
                    <View style={styles.quoteInfoContainer}>
                        <Text style={styles.quoteInfoText}>R.U.T.: {companyInfo.rut}</Text>
                        <Text style={styles.quoteInfoText}>COTIZACIÓN ELECTRÓNICA</Text>
                        <Text style={styles.quoteInfoText}>N° {facturaInfo.nroFactura}</Text>
                    </View>
                </View>

                {/* Datos del Cliente */}
                <View style={styles.section}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Datos del Cliente</Text>
                    <Text>R.U.T.: {clientData.rut}</Text>
                    <Text>RAZÓN SOCIAL: {clientData.razonsocial}</Text>
                    <Text>GIRO: {clientData.giro}</Text>
                    <Text>COMUNA: {clientData.comuna}</Text>
                    <Text>EMAIL: {clientData.email}</Text>
                </View>

                {/* Grilla de imágenes */}
                {/* Renderizado de imágenes horizontales */}
                {horizontalImages.map((img) => (
                    <View key={img.id} style={styles.horizontalImageContainer}>
                        <Image style={styles.horizontalImage} src={img.src} />
                    </View>
                ))}

                {/* Renderizado de imágenes en grilla */}
                <View>
                    {gridRows.map((row, rowIndex) => (
                        <View
                            key={rowIndex}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                            }}
                        >
                            {row.map((img) => (
                                <View key={img.id} style={{ width: '24%' }}>
                                    <Image style={styles.gridImage} src={img.src} />
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Detalle de Productos */}
                <View style={styles.table}>
                    {/* Encabezado de la tabla */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.cellItem]}>Item</Text>
                        <Text style={[styles.tableCell, styles.cellModels]}>Modelos disponibles</Text>
                        <Text style={[styles.tableCell, styles.cellQuantity]}>Cantidad</Text>
                        <Text style={[styles.tableCell, styles.cellPrice]}>Precio</Text>
                        <Text style={[styles.tableCell, styles.lastCell, styles.cellSubtotal]}>Subtotal</Text>
                    </View>
                    {quoteItems.map((item) => (
                        <View style={styles.tableRow} key={item.productID}>
                            <Text style={[styles.tableCell, styles.cellItem]}>{item.name}</Text>
                            <Text style={[styles.tableCell, styles.cellModels]}>{item.availableModels}</Text>
                            <Text style={[styles.tableCell, styles.cellQuantity]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.cellPrice]}>{formatoPrecio(item.price)}</Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.cellSubtotal]}>
                                {formatoPrecio(item.price * item.quantity)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Descuentos y Cargos */}
                <View style={styles.section}>
                    <Text style={{ marginBottom: 4, fontSize: 12, fontWeight: 'bold' }}>Descuentos/Cargos</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCell, styles.cellQuantity]}>Tipo (descuento/cargo)</Text>
                            <Text style={[styles.tableCell, styles.cellQuantity]}>Porcentaje</Text>
                            <Text style={[styles.tableCell, styles.cellQuantity, styles.lastCell]}>Monto</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.cellQuantity]}>Descuento por volumen</Text>
                            {/* <Text style={[styles.tableCell, styles.cellQuantity]}>{(totals.discountPercentage * 100).toFixed(0)}%</Text>
                            <Text style={[styles.tableCell, styles.cellQuantity, styles.lastCell]}>-{totals.discount.toFixed(2)}</Text> */}
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.cellQuantity]}>Cargo por despacho</Text>
                            {/* <Text style={[styles.tableCell, styles.cellQuantity]}>
                                {(totals.dispatchChargePercentage * 100).toFixed(0)}%
                            </Text>
                            <Text style={[styles.tableCell, styles.cellQuantity, styles.lastCell]}>
                                +{totals.dispatchCharge.toFixed(2)}
                            </Text> */}
                        </View>
                    </View>
                </View>

                {/* Totales */}
                <View style={styles.section}>
                    <View style={styles.totalsTable}>
                        <View style={styles.totalsRow}>
                            <Text style={[styles.totalsCell, { flex: 1, fontWeight: 'bold' }]}>MONTO NETO:</Text>
                            <Text style={[styles.totalsCell, { flex: 1, textAlign: 'right' }]}>{totals.netAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={[styles.totalsCell, { flex: 1, textAlign: 'right' }]}>{totals.IVA.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalsRow, { backgroundColor: '#e2e8f0' }]}>
                            <Text style={[styles.totalsCell, { flex: 1, fontWeight: 'bold' }]}>MONTO TOTAL:</Text>
                            <Text style={[styles.totalsCell, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                                {totals.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Datos de Transferencia Bancaria y Resumen */}
                <View style={[styles.section, { flexDirection: 'row' }]}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                        <View style={{ border: '1px solid #ccc', padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Datos de Transferencia Bancaria</Text>
                            <Text>{bankInfo.bank}</Text>
                            <Text>{bankInfo.account}</Text>
                            <Text>Razón Social: {bankInfo.companyName}</Text>
                            <Text>Rut: {bankInfo.rut}</Text>
                            <Text>{bankInfo.email}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ border: '1px solid #ccc', padding: 6 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontWeight: 'bold' }}>MONTO NETO:</Text>
                                <Text>{totals.netAmount.toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text>{totals.IVA.toFixed(2)}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#e2e8f0',
                                    padding: 4,
                                }}
                            >
                                <Text style={{ fontWeight: 'bold' }}>MONTO TOTAL:</Text>
                                <Text style={{ fontWeight: 'bold' }}>{totals.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default MyPDFDocument
