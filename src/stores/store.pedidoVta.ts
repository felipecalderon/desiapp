import { Producto } from '@/config/interfaces';
import { create } from 'zustand';

interface ListaPedido {
	pedidoVta: Producto[];
	setPedido: (pedido: Producto) => void;
	removePedido: (sku: string) => void;
	clearPedido: () => void;
	updateCantidad: (sku: string, cantidad: number) => void;
}

const storeVta = create<ListaPedido>((set) => ({
	pedidoVta: [],

	setPedido: (pedido) =>
		set((state) => ({
			pedidoVta: [...state.pedidoVta, pedido],
		})),

	removePedido: (sku) =>
		set((state) => ({
			pedidoVta: state.pedidoVta.filter((item) => item.sku !== sku),
		})),

	clearPedido: () =>
		set(() => ({
			pedidoVta: [],
		})),

	updateCantidad: (sku: string, cantidad: number) =>
		set((state) => {
			const pedidoVta = state.pedidoVta.map((item) =>
				item.sku === sku ? { ...item, cantidad, subtotal: item.precio*cantidad } : item
			);
			return { pedidoVta };
		}),
}));

export default storeVta;
