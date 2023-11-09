import { create } from 'zustand'

interface ProductVariationInterface {
	variationID: string
	sizeNumber: number
	priceList: number
	priceCost: number
	sku: string
	stockQuantity: number
}

interface ProductInterface {
	productID: string
	name: string
	image: string
	ProductVariations: ProductVariationInterface[]
}

interface DataProduct {
	products: ProductInterface[]
	total: number
	setProducts: (products: ProductInterface[]) => void
	setTotal: (total: number) => void
}

const storeProduct = create<DataProduct>((set) => ({
	products: [],
	total: 0,
	setProducts: (products: ProductInterface[]) => set({ products }),
	setTotal: (totalInput: number) => set({ total: totalInput }),
}))

export default storeProduct
