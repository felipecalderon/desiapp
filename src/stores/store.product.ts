import { Producto } from '@/config/interfaces';
import { create } from 'zustand';

interface DataProduct {
	products: Producto[];
	product: Producto | null;
	total: number;
	setProduct: (product: Producto | null) => void;
	setProducts: (products: Producto[]) => void;
	clearStoreProduct: () => void;
}

const storeProduct = create<DataProduct>((set, get) => ({
	products: [],
	product: null,
	total: 0,
	setProduct: (product: Producto | null) => set({ product }),
	setProducts: (products: Producto[]) => {
		const stateProducts = get().products
		const totalProducts = stateProducts.reduce((acc, { ProductVariations }) => {
			let totalVariations = 0
			ProductVariations.forEach((variacion) => {
				totalVariations += variacion.stockQuantity
			})
			return acc + totalVariations
		}, 0)
		const productosTallaOrden = sortProductVariations(products)
		set({total: totalProducts})
		set({ products: productosTallaOrden });
	},
	clearStoreProduct: () =>
		set((state) => ({
			...state,
			products: [],
			product: null,
			total: 0,
		})),
}));

const sortProductVariations = (products: Producto[]) => {
	const tallasOrdenadas = products.map((product) => {
		// Clonar las variaciones para no modificar el arreglo original
		let sortedVariations = [...product.ProductVariations];

		// Ordenar las variaciones por sizeNumber de menor a mayor
		sortedVariations.sort((a, b) => a.sizeNumber - b.sizeNumber);

		// Retornar el producto con sus variaciones ordenadas
		return { ...product, ProductVariations: sortedVariations };
	});
	
	return tallasOrdenadas
};

export { storeProduct };
