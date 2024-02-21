import { create } from 'zustand'

interface SaleProduct {
    SaleProductID: string,
    saleID: string,
    storeProductID: string,
    quantitySold: number,
    unitPrice: number,
    subtotal: number,
    createdAt: Date,
    updatedAt: Date,
    variationID: string
}

interface Sales {
    saleID: string,
    storeID: string,
    total: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    SaleProducts: SaleProduct[]
}

interface SalesGlobalStore {
    sales: Sales[],
    setSales: (sales: Sales[]) => void,
    totalSales: number,
    totalStores: number,
    totalProducts: number,
    updateTotals: () => void
}

const storeSales = create<SalesGlobalStore>((set, get) => ({
    sales: [],
    setSales: (sales: Sales[]) => set({ sales }),
    totalSales: 0,
    totalStores: 0,
    totalProducts: 0,
    updateTotals: () => {
        // Lógica para actualizar los totales y el conteo de tiendas
        const { sales } = get();
        if (!Array.isArray(sales)) {
            console.error('sales is not an array', sales);
            return; // Salir de la función si sales no es un array
        }

        const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
        const totalProducts = sales.reduce((acc, sale) => {
            return acc + sale.SaleProducts.length
        }, 0)
        const totalStores = new Set(sales.map(sale => sale.storeID)).size;
        set({ totalSales, totalStores, totalProducts });
    }
}));

export default storeSales