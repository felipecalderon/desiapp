import { Producto } from '@/config/interfaces'
import { create } from 'zustand'

interface DataProduct {
	products: Producto[]
	product: Producto | null
	total: number
	setProduct: (product: Producto | null) => void
	setProducts: (products: Producto[]) => void
	setTotal: () => void
	clearStoreProduct: () => void
}

const storeProduct = create<DataProduct>((set) => ({
	products: [],
	product: null,
	total: 0,
	setProduct: (product: Producto | null) => set({product}),
	setProducts: (products: Producto[]) => set({ products: sortProductVariations(products) }),
	setTotal: () => set((state) => {
		const total = calculateTotal(state.products)
		return {...state, total}
	}),
	clearStoreProduct: () => set((state) => ({
		...state, 
		products: [],
		product: null, 
		total: 0, 
	  }))
}))
const calculateTotal = (products: Producto[]) => {
	let total = 0
	products.forEach(({ProductVariations}) => ProductVariations.forEach(({stockQuantity}) => {
		total += Number(stockQuantity)
	}))
	return total
}

const sortProductVariations = (products: Producto[]) => {
    return products.map(product => {
        // Clonar las variaciones para no modificar el arreglo original
        let sortedVariations = [...product.ProductVariations];

        // Ordenar las variaciones por sizeNumber de menor a mayor
        sortedVariations.sort((a, b) => a.sizeNumber - b.sizeNumber);

        // Retornar el producto con sus variaciones ordenadas
        return { ...product, ProductVariations: sortedVariations };
    });
};

export {storeProduct}
