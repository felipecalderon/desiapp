import { configs, method } from '@/config/constants';
import { ProductoConsignacion, ProductoWooBase, VariacionesWoo } from '@/config/interfaces';
import { createBase64Access } from './auth';

export const connectWoo = async (path: string) => {
	try {
		const auth = createBase64Access(configs.wordpressKey, configs.wordpressSecret);
        
		const data: Response = await fetch(`${configs.baseURL_API}/${path}`, {
            next: {
                revalidate: 10
            },
			method: method.GET,
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		if (data.status !== 200) throw 'Error conectando a la tienda';
		const fetchData = await data.json();
		return fetchData;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const cleanProducts = async (productos: ProductoWooBase[]): Promise<ProductoConsignacion[]> => {
    const productosMapPromises: Promise<ProductoConsignacion>[] = productos.map(async (producto: ProductoWooBase) => {
        const tallas = await cleanTallas(producto.id);
        return {
            id: producto.id,
            name: producto.name,
            variations: producto.variations,
            status: producto.status,
            image: producto.images[0].src,
            tallas: tallas,
        };
    });
    
    const productosMap: ProductoConsignacion[] = await Promise.all(productosMapPromises);
    return productosMap.filter(({ status }) => status === 'publish');
}

export const cleanTallas = async (productoId: number) => {
    const tallas: VariacionesWoo[] = await connectWoo(`products/${productoId}/variations`);
    const parseTallas = tallas.map((variacion: VariacionesWoo) => {
        // Asumiendo que siempre habrá exactamente un atributo y que será la talla
        const numero = variacion.attributes?.[0].option || "Desconocido"; 
        return {
            numero, 
            price: variacion.price,
            regular_price: variacion.regular_price,
            sku: variacion.sku,
            stock_quantity: variacion.stock_quantity
        }   
    })
    return parseTallas;
}