import { Producto, ProductosdeOrden } from '@/config/interfaces';

export const calcularParesTotales = (products: ProductosdeOrden[]): number => {
	const newTotal = products.reduce((acc, producto) => {
				return acc + (producto.OrderProduct.quantityOrdered || 0);
			}, 0);
	return newTotal;
};
