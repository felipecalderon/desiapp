'use client'
import { SingleProduct } from '@/config/interfaces';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SingleProduct({ sku }: { sku: string }) {
    const [producto, setProducto] = useState<SingleProduct | null>(null)
    const [mensaje, setMensaje] = useState('No hay productos')
    const [baseURL, setBaseURL] = useState('');

    useEffect(() => {
        setBaseURL(`${window.location.protocol}//${window.location.host}`);
    }, []);

    useEffect(() => {
        const fetchWooData = async () => {
            try {
                setMensaje('Buscando el sku en tienda...')
                const response = await fetch(`${baseURL}/api/woo/${sku}`, {
                    cache: 'no-store',
                });
                if (!response.ok) {
                    throw new Error('Error de conexión a la API de Woocommerce');
                }
                const data = await response.json();
                setMensaje('Producto encontrado')
                setProducto(data);
            } catch (error) {
                setMensaje('Error al consultar producto en tienda')
                console.log(error);
            }
        };

        if (baseURL) {
            fetchWooData();
        }
    }, [baseURL]);

    if (typeof producto !== 'object') return <div><ul><p>{mensaje}</p></ul></div>
    return (
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-center items-center">
                    {producto?.imagen && (
                        <Image
                            src={producto.imagen}
                            alt={producto?.name || 'Producto'}
                            width={300}
                            height={300}
                            className="rounded-md object-cover"
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">{producto?.name}</h2>
                    <ul className="list-disc list-inside">
                        <li>SKU: {producto?.sku}</li>
                        <li>Talla: {producto?.talla}</li>
                        <li>Stock: {producto?.stock}</li>
                    </ul>
                    {producto?.url && (
                        <a
                            href={producto.url}
                            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-700"
                        >
                            Ver más
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}