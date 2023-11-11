// Así parsearé los productos para consignación
export interface Producto {
	productID: string
	name: string
	image: string
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
}

export enum Role {
	Admin = 'admin',
	Proveedor = 'supplier',
	Franquiciado = 'store_manager',
	NO_Franquiciado = 'store_seller',
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
	Users: UserStore[]
}

export interface User {
	userID: string
	role: Role
	name: string
	email: string
	userImg: string
	stores: Store[]
	exp: number
  }

interface UserStore {
	userID: string
	UserStore: {
		UserStoreID: string
		userID: string
		storeID: string
	}
}
