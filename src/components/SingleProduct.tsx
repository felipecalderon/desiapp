'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import storeBarcode from '@/stores/store.barcode';
import useStore from '@/stores/store.pedido';
import { formatoPrecio } from '@/utils/price';
import { SingleProduct } from '@/config/interfaces';

export default function SingleProductComponent() {
    const sku = storeBarcode((state) => state.value);
    const isSend = storeBarcode((state) => state.isSend);
    const [producto, setProducto] = useState<SingleProduct | null>(null);
    const [mensaje, setMensaje] = useState('No hay productos');
    const [baseURL, setBaseURL] = useState('');

    useEffect(() => {
        setBaseURL(`${window.location.protocol}//${window.location.host}`);
    }, []);

    useEffect(() => {
        if (baseURL && isSend) {
            fetchWooData();
        }
    }, [baseURL, isSend]);

    const fetchWooData = async () => {
        try {
            if (!sku) {
                return setMensaje('Por favor escanee un código de barra o escriba SKU');
            }

            setMensaje('Buscando el sku en tienda...');
            const response = await fetch(`${baseURL}/api/woo/${sku}`, { cache: 'no-store' });

            if (!response.ok) {
                throw new Error('Error de conexión a la API de Woocommerce');
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                setMensaje('Sku no identificado');
                return setProducto(null);
            }

            setMensaje('Producto encontrado');
            setProducto(data);
        } catch (error) {
            setMensaje('Error al consultar producto en tienda');
            console.error(error);
        }
    };

    return (
        <div>
            {producto === null ? (
                <Mensaje mensaje={mensaje} />
            ) : (
                <ProductoDetalle producto={producto} />
            )}
        </div>
    );
}

function Mensaje({ mensaje }: { mensaje: string }) {
    return (
        <div>
            <ul>
                <i>{mensaje}</i>
            </ul>
        </div>
    );
}

function ProductoDetalle({ producto }: { producto: SingleProduct }) {
    return (
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagenProducto imagen={producto.imagen} nombre={producto.name} />
                <DetallesProducto producto={producto} />
            </div>
        </div>
    );
}

function ImagenProducto({ imagen, nombre }: { imagen: string; nombre: string }) {
    return (
        <div className="flex justify-center items-center">
            {imagen && (
                <Image src={imagen} alt={nombre || 'Producto'} width={300} height={300} className="rounded-md object-cover" />
            )}
        </div>
    );
}

function DetallesProducto({ producto }: { producto: SingleProduct }) {
    const { pedido, setPedido, updateCantidad, removePedido } = useStore();

    const [cantidad, setCantidad] = useState(producto.stock);

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevaCantidad = parseInt(e.target.value, 10);
        if (!isNaN(nuevaCantidad)) {
          setCantidad(nuevaCantidad);
          updateCantidad(producto.sku, nuevaCantidad);
        }
    };

    const handleAgregarAlPedido = () => {
        const buscarPedido = pedido.find(({sku}) => sku === producto.sku)
        if(buscarPedido) removePedido(producto.sku)
        setPedido({ cantidad, sku: producto.sku, precio: Number(producto.price)/1.8 }); 
        console.log(pedido);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">{producto.name}</h2>
            <ul className="list-disc list-inside">
                <li>SKU: {producto.sku}</li>
                <li>Precio lista: {formatoPrecio(producto.price)}</li>
                <li>Precio vta neto: {formatoPrecio(Number(producto.price)/1.8)}</li>
                <li>Talla: {producto.talla}</li>
                <li>Stock: {producto.stock}</li>
            </ul>
            <hr className='opacity-20 my-1'/>
            <p className='dark:text-white text-gray-900'>Ingrese la cantidad a solicitar</p>
            <input
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                className="w-full p-2 rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa la cantidad"
            />
            {producto.url && (
                <button 
                    className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-700"
                    onClick={handleAgregarAlPedido}
                >
                    Agregar al Pedido
                </button>
            )}
        </div>
    );
}