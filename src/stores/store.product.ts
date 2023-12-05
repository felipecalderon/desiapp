import { Producto } from '@/config/interfaces'
import { create } from 'zustand'

interface DataProduct {
	products: Producto[]
	product: Producto | null
	total: number
	setProduct: (product: Producto) => void
	setProducts: (products: Producto[]) => void
	setTotal: (total: number) => void
}

const storeProduct = create<DataProduct>((set) => ({
	products: [],
	product: null,
	total: 0,
	setProduct: (product: Producto) => set({product}),
	setProducts: (products: Producto[]) => set({ products: sortProductVariations(products) }),
	setTotal: (totalInput: number) => set({ total: totalInput }),
}))

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

export default storeProduct
