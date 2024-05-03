import { OrdendeCompra, Sales, Store } from '@/config/interfaces';
import { create } from 'zustand';

interface SalesGlobalStore {
	sales: Sales[];
	orders: OrdendeCompra[]
	setOrders: (orders: OrdendeCompra[]) => void
	setSales: (sales: Sales[]) => void;
	totalSales: number;
	totalStores: number;
	totalProducts: number;
	filteredSales: () => Sales[];
	setFilterMonth: (month: string | null) => void;
	setFilterYear: (year: string | null) => void;
	filterMonth: string | null;
	filterYear: string | null;
}

const storeSales = create<SalesGlobalStore>((set, get) => ({
	sales: [],
	orders: [],
	totalSales: 0,
	totalStores: 0,
	totalProducts: 0,
	filterMonth: null,
	filterYear: null,
	setOrders: (orders) => set({ orders }),
	setSales: (sales) => set({ sales }),
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
