'use client'
import { configs } from '@/config/constants';
import { useEffect, useState } from 'react';
import useStore from '@/stores/store.barcode';
import ProductoDetalle from './ProductSection';

const fetchSingleProduct = async (sku: string) => {
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
    const [mensaje, setMensaje] = useState('Ingrese código de barra para buscar stock')
  
    useEffect(() => {
      if (sku) {
        setMensaje('Buscando producto en base de datos...')
        fetchSingleProduct(sku)
            .then((data) => {
                if(!data){
                    setMensaje('No se encontró el producto en la base de datos :(')
                    return setProducto(null)
                } 
                setProducto(data)
            })
            .catch(() => setMensaje('Hubo un error al consultar productos.. refresque la página'))
      }
    }, [isSend]);
    if(producto) return <ProductoDetalle producto={producto} />
    else return mensaje
  }