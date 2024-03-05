import { Sales, Store } from '@/config/interfaces';
import { create } from 'zustand';

interface SalesGlobalStore {
	sales: Sales[];
	setSales: (sales: Sales[]) => void;
	totalSales: number;
	totalStores: number;
	totalProducts: number;
	updateTotals: () => void;
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
			let acum = acc;
			sale.SaleProducts.forEach((variations) => {
				if (variations.quantitySold) {
					acum += Number(variations.quantitySold); // es venta normal
				}else{
                    acum += Number(variations.quantityOrdered); // es venta (OC de terceros)
                }
			});
			return acum;
		}, 0);
		const totalStores = new Set(sales.map((sale) => sale.storeID)).size;
		set({ totalSales, totalStores, totalProducts });
	},
}));

export default storeSales;
