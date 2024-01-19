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
		set((state) => {
			let producto = state.pedidoVta.map((product) => {
				return {
				  ...product,
				  ProductVariations: product.ProductVariations?.filter(
					(variation) => variation.sku !== sku
				  ),
				};
			  })
			  if(!producto){
				return { pedidoVta: []}
			  }else{
				return { pedidoVta: producto }
			  }
		}),

	clearPedido: () => set({ pedidoVta: [] }),

	updateCantidad: (sku, cantidad) =>
		set((state) => {
			const index = state.pedidoVta.findIndex(({ ProductVariations }) =>
				ProductVariations?.some(({ sku: skuVar }) => skuVar === sku)
			);

			if (index !== -1) {
				const updatedPedido = { ...state.pedidoVta[index], cantidad };
				const updatedPedidos = [...state.pedidoVta];
				updatedPedidos[index] = updatedPedido;

				return { pedidoVta: updatedPedidos };
			}

			return state;
		}),
}));

export default storeVta;
