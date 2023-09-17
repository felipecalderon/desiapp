'use client'

import { SingleProduct } from "@/config/interfaces";
import useStore from "@/stores/store.pedido";
import { formatoPrecio } from "@/utils/price";
import { useState } from "react";

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

export default DetallesProducto