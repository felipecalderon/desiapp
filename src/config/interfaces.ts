// Así parsearé los productos para consignación
export interface Producto {
    productID: string
    name: string
    image: string
    cantidad: number
    totalProducts: number
    ProductVariations: Variacion[]
}

// Así se definen las variaciones que tiene cada producto
export interface Variacion {
    variationID: string
    sizeNumber: number
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
    storeProductID: string
    StoreProducts: ProductosdeTienda[]
}

export enum Role {
    Admin = 'admin',
    Franquiciado = 'store_manager',
    Consignado = 'consignado',
    Tercero = 'tercero',
}

export interface Store {
    storeID: string
    name: string
    email: string
    storeImg: string | null
    location: string
    rut: string
    role: string
    phone: string
    address: string
    city: string
    isAdminStore: boolean
    createdAt: Date
    updatedAt: Date
    markup: string
    Users: User[]
}

export interface User {
    userID: string
    role: Role
    name: string
    email: string
    userImg: string
    Stores: Store[]
    exp: number
}
export interface ProductosdeTienda {
    Store: Store
    createdAt: Date
    updatedAt: Date
    priceCostStore: string
    quantity: number
    storeID: string
    storeProductID: string
    variationID: string
}

export interface ProductOrderDetail {
    orderID: string
    variationID: string
    quantityOrdered: number
    priceCost: number
    subtotal: number
}

export interface ProductosdeOrden {
    variationID: string
    productID: string
    sizeNumber: number
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
    productName: string
    total: number
    name: string
    image: string
    OrderProduct: ProductOrderDetail
    Product: Producto
}

export interface OrdendeCompra {
    orderID: string
    storeID: string
    userID: string
    total: number
    status: string
    createdAt: Date
    updatedAt: Date
    dte?: string
    expiration: string
    type: 'OCD' | 'OCC' | 'OCR' | 'OCP'
    expirationPeriod: 'UNICO' | 'MENSUAL'
    ProductVariations: ProductosdeOrden[]
    Store: Store
    User: User
    discount: string
    startQuote: number
    endQuote: number
}

export interface SaleProduct {
    Product: Producto
    ProductVariation: Variacion
    SaleProductID: string
    saleID: string
    storeProductID: string
    quantitySold: number
    unitPrice: number
    subtotal: number
    createdAt: Date
    updatedAt: Date
    variationID: string
    name: string
    priceCost: string
    priceCostStore: string
    quantityOrdered: number
    sizeNumber: number
}

export interface Sales {
    saleID: string
    storeID: string
    total: number
    status: 'Pendiente' | 'Pagado' | 'Recibido' | 'Enviado' | 'Facturado'
    createdAt: Date
    updatedAt: Date
    SaleProducts: SaleProduct[]
    Store: Store
    type?: string
}

export interface DTE {
    xmlns: string
    'xmlns:xsi': string
    version: string
    Documento: Documento
    Signature: Signature
}

export interface Documento {
    ID: string
    Encabezado: Encabezado
    Detalle: Detalle[] | Detalle
    TED: TED
    TmstFirma: string
}

export interface Encabezado {
    IdDoc: IdDoc
    Emisor: Emisor
    Receptor: Receptor
    RUTSolicita: string
    Totales: Totales
}

export interface IdDoc {
    TipoDTE: string
    Folio: string
    FchEmis: string
    MntBruto: string
}

export interface Emisor {
    RUTEmisor: string
    RznSoc: string
    GiroEmis: string
    Acteco: string
    Sucursal: string
    CdgSIISucur: string
    DirOrigen: string
    CmnaOrigen: string
    CiudadOrigen: string
}

export interface Receptor {
    RUTRecep: string
    RznSocRecep: string
    Extranjero: string
    GiroRecep: string
    DirRecep: string
    CmnaRecep: string
    CiudadRecep: string
}

export interface Totales {
    MntNeto: string
    TasaIVA: string
    IVA: string
    MntTotal: string
}

export interface Detalle {
    NroLinDet: string
    CdgItem: CdgItem
    NmbItem: string
    PrcRef: string
    QtyItem: string
    UnmdItem: string
    PrcItem: string
    MontoItem: string
}

export interface CdgItem {
    TpoCodigo: string
    VlrCodigo: string
}

export interface TED {
    version: string
    DD: DD
    FRMT: FRMT
}

export interface DD {
    RE: string
    TD: string
    F: string
    FE: string
    RR: string
    RSR: string
    MNT: string
    IT1: string
    CAF: CAF
    TSTED: string
}

export interface CAF {
    version: string
    DA: DA
    FRMA: FRMA
}

export interface DA {
    RE: string
    RS: string
    TD: string
    RNG: RNG
    FA: string
    RSAPK: RSAPK
    IDK: string
}

export interface RNG {
    D: string
    H: string
}

export interface RSAPK {
    M: string
    E: string
}

export interface FRMA {
    _: string
    algoritmo: string
}

export interface FRMT {
    _: string
    algoritmo: string
}

export interface Signature {
    xmlns: string
    SignedInfo: SignedInfo
    SignatureValue: string
    KeyInfo: KeyInfo
}

export interface SignedInfo {
    CanonicalizationMethod: CanonicalizationMethod
    SignatureMethod: SignatureMethod
    Reference: Reference
}

export interface CanonicalizationMethod {
    Algorithm: string
}

export interface SignatureMethod {
    Algorithm: string
}

export interface Reference {
    URI: string
    Transforms: Transforms
    DigestMethod: DigestMethod
    DigestValue: string
}

export interface Transforms {
    Transform: Transform
}

export interface Transform {
    Algorithm: string
}

export interface DigestMethod {
    Algorithm: string
}

export interface KeyInfo {
    KeyValue: KeyValue
    X509Data: X509Data
}

export interface KeyValue {
    RSAKeyValue: RSAKeyValue
}

export interface RSAKeyValue {
    Modulus: string
    Exponent: string
}

export interface X509Data {
    X509Certificate: string
}
