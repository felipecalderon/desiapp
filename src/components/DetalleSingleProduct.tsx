'use client'

import { SingleProduct } from "@/config/interfaces";
import storeVta from "@/stores/store.pedidoVta";
import { formatoPrecio } from "@/utils/price";
import { usePathname } from "next/navigation";
import { useState } from "react";

function DetallesProducto({ producto }: { producto: SingleProduct }) {
    const { pedidoVta, setPedido, updateCantidad, removePedido } = storeVta();
    const path = usePathname()
    console.log({ path });
    const [cantidad, setCantidad] = useState(1);

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevaCantidad = parseInt(e.target.value, 10);
        if (!isNaN(nuevaCantidad)) {
            if (nuevaCantidad <= 0) {
                e.target.value = "0"
                setCantidad(0)
            }
            setCantidad(nuevaCantidad);
            updateCantidad(producto.sku, nuevaCantidad);
        }
    };

    const handleAgregarAlPedido = () => {
        const buscarPedido = pedidoVta.find(({ sku }) => sku === producto.sku)
        if (buscarPedido) removePedido(producto.sku)
        setPedido({ cantidad, sku: producto.sku, precio: Number(producto.price) / 1.8 });
    };

    return (
        <div>
            <div className="flex flex-row items-center gap-3">
            <div className="w-12 h-12 bg-red-600 flex flex-col justify-center items-center p-1">
                <span className="text-xs mb-1">Talla</span>
                <span className="text-lg font-bold">{producto.talla}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{producto.name}</h2>
            </div>
            <ul className="list-disc list-inside">
                <li>SKU: {producto.sku}</li>
                <li>Precio Venta: {formatoPrecio(producto.price)}</li>
                <li>Stock: {producto.stock}</li>
            </ul>
            <hr className='opacity-20 my-1' />
            <p className='dark:text-white text-gray-900'>Ingrese la cantidad a vender</p>
            <input
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                className="w-full p-2 rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa la cantidad"
            />
            <button
                className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-700"
                onClick={handleAgregarAlPedido}>
                Agregar al Pedido
            </button>
            <p className='dark:text-white text-gray-900'>Subtotal: {formatoPrecio(Number(producto.price) * cantidad)}</p>
        </div>
    );
}

export default DetallesProducto