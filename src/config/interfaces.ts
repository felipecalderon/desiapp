// Así parsearé los productos para consignación
export interface Producto {
	productID: string
	name: string
	image: string
	cantidad: number
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
	storeImg: string | null
	location: string
	rut: string
	phone: string
	address: string
	city: string
	isAdminStore: boolean
	createdAt: Date
	updatedAt: Date
	markup: string,
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

export interface ProductosdeOrden {
	variationID: string
    productID: string
    sizeNumber: number
    priceList: number
    priceCost: number
    sku: string
    stockQuantity:number
    quantityOrdered: number
    subtotal: number
    name: string
    image: string
}

export interface OrdendeCompra {
	orderID: string;
	storeID: string;
	userID: string;
	total: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	dte?: string;
	ProductVariations: ProductosdeOrden[];
	Store: Store;
	User: User
}

export interface SaleProduct {
    SaleProductID: string,
    saleID: string,
    storeProductID: string,
    quantitySold: number,
    unitPrice: number,
    subtotal: number,
    createdAt: Date,
    updatedAt: Date,
    variationID: string
}

export interface Sales {
    saleID: string,
    storeID: string,
    total: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    SaleProducts: SaleProduct[]
    Store: Store
	type?: string
}
