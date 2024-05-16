import { Producto } from '@/config/interfaces'
import { create } from 'zustand'

interface DataProduct {
    globalProducts: Producto[]
    setGlobalProducts: (products: Producto[]) => void
    products: Producto[]
    product: Producto | null
    setProduct: (product: Producto | null) => void
    setProducts: (products: Producto[]) => void
    clearStoreProduct: () => void
}

const storeProduct = create<DataProduct>((set, get) => ({
    globalProducts: [],
    products: [],
    product: null,
    setProduct: (product) => set({ product }),
    setProducts: (products) => {
        const productosTallaOrden = sortProductVariations(products)
        set({ products: productosTallaOrden })
    },
    setGlobalProducts: (products) => {
        const productosTallaOrden = sortProductVariations(products)
        set({ globalProducts: productosTallaOrden })
    },
    clearStoreProduct: () =>
        set((state) => ({
            ...state,
            products: [],
            product: null,
            total: 0,
        })),
}))

const sortProductVariations = (products: Producto[]) => {
    const tallasOrdenadas = products.map((product) => {
        // Clonar las variaciones para no modificar el arreglo original
        let sortedVariations = [...product.ProductVariations]

        // Ordenar las variaciones por sizeNumber de menor a mayor
        sortedVariations.sort((a, b) => a.sizeNumber - b.sizeNumber)

        // Retornar el producto con sus variaciones ordenadas
        return { ...product, ProductVariations: sortedVariations }
    })
    return tallasOrdenadas
}

export { storeProduct }
