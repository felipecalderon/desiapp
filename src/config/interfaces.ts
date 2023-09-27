// Así vienen los productos desde WooCommerce
export interface ProductoWooBase {
	id: number;
	sku: string;
	name: string;
	slug: string;
	permalink: string;
	description: string;
	short_description: string;
	price: string;
	regular_price: string;
	stock_quantity: number;
	categories: { id: number; name: string }[];
	images: { src: string; name: string; alt: string }[];
	attributes: { name: string; options: string[]; option: string }[];
	variations: number[];
	status: string;
}

// Así parsearé los productos para consignación
export interface ProductoConsignacion extends Partial<ProductoWooBase> {
	image: string;
	tallas?: VariacionesWoo[];
}

// Así se definen los atributos, ej: {id: 1, name: "talla", option: "3"}
export interface AtributosdelProducto {
	id: number;
	name: string;
	option: string;
}

// Así se definen las variaciones que tiene cada producto
export interface VariacionesWoo {
	attributes?: AtributosdelProducto[];
	numero?: string;
	price: string;
	regular_price: string;
	sku: string;
	stock_quantity: number;
}

// Estructura producto individual
export interface SingleProduct {
	id: number;
	sku: string;
	name: string;
	status: string;
	url: string;
	imagen: string;
	talla: string;
	stock: number;
	price: string;
}

// Estructura del producto cuando se añade en compras/ventas
export interface Producto {
	nombre: string;
	talla: string;
	sku: string;
	cantidad: number;
	precio: number;
	subtotal: number;
}
