import { Producto } from '@/config/interfaces';
import { create } from 'zustand';
interface ProductosCompra {
	variationID: string;
	quantityOrdered: number;
}

interface ListaCompra {
	storeID: string | null;
	userID: string | null;
	productos: ProductosCompra[];
	setPedido: (variacion: ProductosCompra) => void;
	removePedido: (sku: string) => void;
	clearPedido: () => void;
	updateCantidad: (sku: string, cantidad: number) => void;
}

const storeCpra = create<ListaCompra>((set) => ({
	productos: [],
	storeID: null,
	userID: null,

	setPedido: (variacion) =>
		set((state) => ({
			...state,
			productos: [...state.productos, variacion],
		})),

	removePedido: (variationID) =>
		set((state) => ({
			...state,
			productos: state.productos.filter(
				(producto) => producto.variationID !== variationID
			),
		})),

	clearPedido: () => set({ productos: [], storeID: null, userID: null }),

	updateCantidad: (variationID, cantidad) =>
		set((state) => ({
			...state,
			productos: state.productos.map((producto) =>
				producto.variationID === variationID
					? { ...producto, quantityOrdered: cantidad }
					: producto
			),
		})),
}));

export default storeCpra;
