import { Producto } from '@/config/interfaces'
import { create } from 'zustand'

interface ListaPedidoCompra {
	pedidoCompra: Producto[]
	setPedido: (pedido: Producto) => void
	removePedido: (sku: string) => void
	clearPedido: () => void
	updateCantidad: (sku: string, cantidad: number) => void
}

const storeCpra = create<ListaPedidoCompra>((set) => ({
	pedidoCompra: [],

	setPedido: (pedido) =>
		set((state) => ({
			pedidoCompra: [...state.pedidoCompra, pedido],
		})),

	removePedido: (sku) =>
		set((state) => ({
			pedidoCompra: state.pedidoCompra.filter((item) => item.sku !== sku),
		})),

	clearPedido: () =>
		set(() => ({
			pedidoCompra: [],
		})),

	updateCantidad: (sku: string, cantidad: number) =>
		set((state) => {
			const pedidoCompra = state.pedidoCompra.map((item) =>
				item.sku === sku ? { ...item, cantidad } : item
			)
			return { pedidoCompra }
		}),
}))

export default storeCpra
