import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { Producto } from '@/config/interfaces'

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
        flex: 1,
    },
    lastCell: {
        borderRight: 0,
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
    button: {
        backgroundColor: '#0284c7',
        padding: 6,
        textAlign: 'center',
        color: '#fff',
        marginTop: 12,
        borderRadius: 4,
    },
    // Contenedor para las imágenes horizontales
    horizontalImageContainer: {
        marginBottom: 10,
    },
    horizontalImage: {
        width: '100%',
        height: 150, // Puedes ajustar la altura para lograr la proporción deseada (ej. 16:9)
        objectFit: 'cover', // Nota: react-pdf interpreta esto de forma limitada
    },
    // Contenedor de grilla para imágenes cuadradas
    gridContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '32%', // Si usas tres columnas, ajusta este porcentaje
        marginBottom: 10,
    },
    gridImage: {
        width: '100%',
        height: 100, // Fija la altura para que se vea cuadrada, o calcula según el ancho
        objectFit: 'cover',
    },
})

interface ClientForm {
    rut: string
    razonsocial: string
    giro: string
    comuna: string
    email: string
}

interface QuoteItem extends Producto {
    quantity: number
    price: number
    availableModels: string
}

interface Images {
    id: string
    src: string
    alt: string
}

interface Totals {
    netAmount: number
    IVA: number
    total: number
    discount: number
    discountPercentage: number
    dispatchCharge: number
    dispatchChargePercentage: number
    IVAPercentage: number
}

interface MyPDFDocumentProps {
    clientData: ClientForm
    quoteItems: QuoteItem[]
    totals: Totals
    horizontalImages: Images[]
    gridImages: Images[]
    companyInfo?: {
        name: string
        address: string
        email: string
        rut: string
    }
    bankInfo?: {
        bank: string
        account: string
        companyName: string
        rut: string
        email: string
    }
    logoSrc?: string
}

const MyPDFDocument = ({
    clientData,
    quoteItems,
    totals,
    horizontalImages,
    gridImages,
    companyInfo = {
        name: 'D3SI SPA',
        address: 'ALMAGRO 593, PURÉN, LA ARAUCANÍA',
        email: 'alejandro.contreras@d3si.cl',
        rut: '77.058.146-K',
    },
    bankInfo = {
        bank: 'Banco de Chile',
        account: 'Cta Cte 144 032 6403',
        companyName: 'D3SI SpA',
        rut: '77.058.146-K',
        email: 'alejandro.contreras@d3si.cl',
    },
    logoSrc = '/media/two-brands-color.png',
}: MyPDFDocumentProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.headerContainer}>
                    <View style={styles.companyInfo}>
                        <View style={styles.logoContainer}>
                            <Image src={logoSrc} style={styles.logo} />
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
                <Page size="A4" style={styles.page}>
                    {/* Renderizado de imágenes horizontales */}
                    {horizontalImages.map((img) => (
                        <View key={img.id} style={styles.horizontalImageContainer}>
                            <Image style={styles.horizontalImage} src={img.src} />
                        </View>
                    ))}

                    {/* Renderizado de imágenes en grilla */}
                    <View style={styles.gridContainer}>
                        {gridImages.map((img) => (
                            <View key={img.id} style={styles.gridItem}>
                                <Image style={styles.gridImage} src={img.src} />
                            </View>
                        ))}
                    </View>
                </Page>
                {/* Detalle de Productos */}
                <View style={styles.section}>
                    <Text style={{ marginBottom: 4, fontSize: 12, fontWeight: 'bold' }}>Detalle de Productos</Text>
                    <View style={styles.table}>
                        {/* Encabezado de la tabla */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Item</Text>
                            <Text style={styles.tableCell}>Modelos disponibles</Text>
                            <Text style={styles.tableCell}>Cantidad</Text>
                            <Text style={styles.tableCell}>Precio</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>Subtotal</Text>
                        </View>
                        {quoteItems.map((item: any) => (
                            <View style={styles.tableRow} key={item.productID}>
                                <Text style={styles.tableCell}>{item.name}</Text>
                                <Text style={styles.tableCell}>{item.availableModels}</Text>
                                <Text style={styles.tableCell}>{item.quantity}</Text>
                                <Text style={styles.tableCell}>{item.price}</Text>
                                <Text style={[styles.tableCell, styles.lastCell]}>{(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Descuentos y Cargos */}
                <View style={styles.section}>
                    <Text style={{ marginBottom: 4, fontSize: 12, fontWeight: 'bold' }}>Descuentos/Cargos</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Tipo (descuento/cargo)</Text>
                            <Text style={styles.tableCell}>Porcentaje</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>Monto</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Descuento por volumen</Text>
                            <Text style={styles.tableCell}>{(totals.discountPercentage * 100).toFixed(0)}%</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>-{totals.discount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Cargo por despacho</Text>
                            <Text style={styles.tableCell}>{(totals.dispatchChargePercentage * 100).toFixed(0)}%</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>+{totals.dispatchCharge.toFixed(2)}</Text>
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
                            <Text style={[styles.totalsCell, { flex: 1, fontWeight: 'bold' }]}>
                                IVA: {(totals.IVAPercentage * 100).toFixed(0)}%
                            </Text>
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
                                <Text style={{ fontWeight: 'bold' }}>IVA: {(totals.IVAPercentage * 100).toFixed(0)}%</Text>
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
