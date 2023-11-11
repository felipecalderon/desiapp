import { Producto } from '@/config/interfaces'
import { create } from 'zustand'

interface ListaPedido {
	pedidoCompra: Producto[]
	setPedido: (pedido: Producto) => void
	removePedido: (sku: string) => void
	clearPedido: () => void
	updateCantidad: (sku: string, cantidad: number) => void
}

const storeCpra = create<ListaPedido>((set) => ({
	pedidoCompra: [],
	
	setPedido: (pedido) =>
		set((state) => ({
			pedidoCompra: [...state.pedidoCompra, pedido],
		})),

	removePedido: (sku) =>
		set((state) => ({
			pedidoCompra: state.pedidoCompra.filter(({ProductVariations}) => ProductVariations.some(({sku: skuVar}) => skuVar === sku)),
		})),

	clearPedido: () => set({ pedidoCompra: [] }),

	updateCantidad: (sku, cantidad) =>
		  set((state) => {
			const index = state.pedidoCompra.findIndex(
			  ({ ProductVariations }) => ProductVariations?.some(({ sku: skuVar }) => skuVar === sku)
			);
	  
			if (index !== -1) {
			  const updatedPedido = { ...state.pedidoCompra[index], cantidad };
			  const updatedPedidos = [...state.pedidoCompra];
			  updatedPedidos[index] = updatedPedido;
	  
			  return { pedidoCompra: updatedPedidos };
			}
	  
			return state;
		  }),
}))

export default storeCpra
