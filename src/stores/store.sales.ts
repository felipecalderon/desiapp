import { Sales, Store } from '@/config/interfaces';
import { create } from 'zustand';

interface SalesGlobalStore {
	sales: Sales[];
	setSales: (sales: Sales[]) => void;
	totalSales: number;
	totalStores: number;
	totalProducts: number;
	updateTotals: () => void;
	filteredSales: () => Sales[];
	setFilterMonth: (month: string | null) => void;
	setFilterYear: (year: string | null) => void;
	filterMonth: string | null;
	filterYear: string | null;
}

const storeSales = create<SalesGlobalStore>((set, get) => ({
	sales: [],
	setSales: (sales: Sales[]) => set({ sales }),
	totalSales: 0,
	totalStores: 0,
	totalProducts: 0,
	updateTotals: () => {
		// Lógica para actualizar los totales y el conteo de tiendas
		const { filteredSales } = get();
		const sales = filteredSales()
		if (!Array.isArray(sales)) {
			console.error('sales is not an array', sales);
			return; // Salir de la función si sales no es un array
		}

		const totalSales = sales.reduce((acc, sale) => {
			const estaVendido = sale.status === "Pagado" || sale.status === "Recibido" || sale.status === "Facturado"
			if(estaVendido ) return acc + sale.total
			else return acc
		}, 0);

		const totalProducts = sales.reduce((acc, sale) => {
			let acum = acc;
			sale.SaleProducts.forEach((variations) => {
				if (variations.quantitySold) {
					acum += Number(variations.quantitySold); // es venta normal
				} else {
					acum += Number(variations.quantityOrdered); // es venta (OC de terceros)
				}
			});
			return acum;
		}, 0);
		const totalStores = new Set(sales.map((sale) => sale.storeID)).size;
		set({ totalSales, totalStores, totalProducts });
	},
	filterMonth: null,
	filterYear: null,
	setFilterMonth: (month) => set(() => ({ filterMonth: month })),
	setFilterYear: (year) => set(() => ({ filterYear: year })),
	filteredSales: () => {
		const { sales, filterMonth, filterYear } = get();
		return sales.filter((sale) => {
			const saleDate = new Date(sale.createdAt);
			// Convierte la fecha de venta a mes y año para comparación
			const saleMonth = saleDate.toLocaleString('default', {
				month: 'long',
			});
			const saleYear = saleDate.getFullYear().toString();

			// Verifica si el filtro de mes y año es null y ajusta el filtrado
			const isMonthMatch = filterMonth ? saleMonth === filterMonth : true;
			const isYearMatch = filterYear ? saleYear === filterYear : true;

			// Devuelve la venta si coincide con los filtros de mes y año
			return isMonthMatch && isYearMatch;
		});
	},
}));

export default storeSales;
