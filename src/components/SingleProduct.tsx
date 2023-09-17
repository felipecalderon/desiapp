'use client'
import { configs } from '@/config/constants';
import { useEffect, useState } from 'react';
import useStore from '@/stores/store.barcode';
import ProductoDetalle from './SingleProductDetail';

const fetchSingleProduct = async (sku: string) => {
    console.log({sku: configs.baseURL_CURRENT});
    
    if (sku !== '') {
        const response = await fetch(`${configs.baseURL_CURRENT}/api/woo/${sku}`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Error de conexión a la API de Woocommerce');
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            return null;
        }
        return data;
    }
    return null;
}

export default function SingleProductComponent() {
    const {sku, isSend} = useStore();
    const [producto, setProducto] = useState(null);
  
    useEffect(() => {
      if (sku) {
        fetchSingleProduct(sku).then((data) => setProducto(data))
            .catch((error) => console.error(error))
      }
    }, [isSend]);
  
    return (
    <>
        <div>SKU: {sku}</div>
        <ProductoDetalle producto={producto} />
    </>
    )
  }