import { Producto } from '@/config/interfaces';
import { create } from 'zustand';

interface ListaPedido {
	pedido: Producto[];
	setPedido: (pedido: Producto) => void;
	removePedido: (sku: string) => void;
	clearPedido: () => void;
	updateCantidad: (sku: string, cantidad: number) => void;
}

const useStore = create<ListaPedido>((set) => ({
	pedido: [],

	setPedido: (pedido) =>
		set((state) => ({
			pedido: [...state.pedido, pedido],
		})),

	removePedido: (sku) =>
		set((state) => ({
			pedido: state.pedido.filter((item) => item.sku !== sku),
		})),

	clearPedido: () =>
		set(() => ({
			pedido: [],
		})),

	updateCantidad: (sku: string, cantidad: number) =>
		set((state) => {
			const pedido = state.pedido.map((item) =>
				item.sku === sku ? { ...item, cantidad } : item
			);
			return { pedido };
		}),
}));

export default useStore;
