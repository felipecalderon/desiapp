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
	setProducts: (products: Producto[]) => set({ products }),
	setTotal: (totalInput: number) => set({ total: totalInput }),
}))

export default storeProduct
