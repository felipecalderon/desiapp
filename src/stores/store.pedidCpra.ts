import { Producto } from '@/config/interfaces';
import { create } from 'zustand';
interface ProductosCompra {
	variationID: string;
	quantityOrdered: number;
	price: number;
}

interface ListaCompra {
	storeID: string | null;
	userID: string | null;
	productos: ProductosCompra[];
	totalProductos: number;
	totalNeto: number;
	setStoreID: (storeID: string) => void
	setUserID: (userID: string) => void
	setPedido: (variacion: ProductosCompra) => void;
	removePedido: (sku: string) => void;
	clearPedido: () => void;
	updateCantidad: (sku: string, cantidad: number) => void;
}

const storeCpra = create<ListaCompra>((set) => ({
	productos: [],
	storeID: null,
	userID: null,
	totalProductos: 0,
	totalNeto: 0,
	setStoreID: (storeID) => set({storeID}),
	setUserID: (userID) => set({userID}),
	setPedido: (variacion) =>
		set((state) => ({
			...state,
			productos: [...state.productos, variacion],
			totalProductos: state.totalProductos + variacion.quantityOrdered,
			totalNeto: state.totalNeto + Number(variacion.price),
		})),

	removePedido: (variationID) =>
		set((state) => {
			const removedProducto = state.productos.find(
				(producto) => producto.variationID === variationID
			);

			return {
				...state,
				productos: state.productos.filter(
					(producto) => producto.variationID !== variationID
				),
				totalProductos:
					state.totalProductos -
					(removedProducto?.quantityOrdered || 0),
				totalNeto: state.totalNeto - (Number(removedProducto?.price) || 0),
			};
		}),

	clearPedido: () =>
		set({
			productos: [],
			storeID: null,
			userID: null,
			totalProductos: 0,
			totalNeto: 0,
		}),

	updateCantidad: (variationID, cantidad) =>
		set((state) => {
			const updatedProductos = state.productos.map((producto) =>
				producto.variationID === variationID
					? { ...producto, quantityOrdered: cantidad }
					: producto
			);

			return {
				...state,
				productos: updatedProductos,
				totalProductos: updatedProductos.reduce(
					(acc, producto) => acc + producto.quantityOrdered,
					0
				),
				totalNeto: updatedProductos.reduce(
					(acc, producto) => acc + Number(producto.price) * producto.quantityOrdered,
					0
				),
			};
		}),
}));

export default storeCpra;
