'use client'

import { Producto } from "@/config/interfaces"
import storeVta from "@/stores/store.pedidoVta"
import storeProduct from "@/stores/store.product"
import { formatoPrecio } from "@/utils/price"
import { useState } from "react"

function DetallesProducto({ producto }: { producto: Producto }) {
    const [cantidad, setCantidad] = useState(1)
    const {} = storeVta()

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se pasa el evento a un numero para poder hacer cálculo despues
        const nuevaCantidad = parseInt(e.target.value, 10)
        if (!isNaN(nuevaCantidad)) {
            setCantidad(nuevaCantidad)
        }
    }

    // const handleAgregarAlPedido = () => {
    //     const buscarPedido = pedidoVta.find(({ sku }) => sku === producto.sku)

    //     // Si la cantidad es 0 y el producto ya está en el pedido, se saca
    //     if (cantidad === 0 && buscarPedido) {
    //         removePedido(producto.sku)
    //         return // Sal del manejador
    //     }

    //     // Si la cantidad no es 0 y el producto ya está en el pedido, se actualiza la cantidad
    //     if (buscarPedido && cantidad !== 0) {
    //         updateCantidad(producto.sku, cantidad)
    //         return // Sal del manejador
    //     }

    //     // Si el producto no está en el pedido, se agrega
    //     if (!buscarPedido) {
    //         setPedido({
    //             cantidad: cantidad,
    //             sku: producto.sku,
    //             precio: Number(producto.price),
    //             nombre: producto.name,
    //             subtotal: Number(producto.price) * cantidad,
    //             talla: producto.talla
    //         })
    //     }
    // }
    const {priceCost, priceList, sizeNumber, sku, stockQuantity, variationID} = producto.ProductVariations[0]
    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 bg-red-600 flex flex-col justify-center items-center p-1">
                    <span className="text-xs mb-1">Talla</span>
                    <span className="text-lg font-bold">{sizeNumber}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{producto.name}</h2>
            </div>
            <ul className="list-disc list-inside">
                <li>SKU: {sku}</li>
                <li>Precio Venta: {formatoPrecio(priceList)}</li>
                <li>Stock: {stockQuantity}</li>
            </ul>
            <hr className='opacity-20 my-1' />
            {Number(stockQuantity) !== 0 ? <div>
                    <p className='dark:text-white text-gray-900'>Ingrese la cantidad a vender</p>
                    <input
                        type="number"
                        value={cantidad}
                        min={0}
                        max={stockQuantity}
                        onChange={handleCantidadChange}
                        className="w-full p-2 rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                        placeholder="Ingresa la cantidad"
                    />
                    <p className='dark:text-white text-gray-900 py-2'>Subtotal: {formatoPrecio(Number(priceList) * cantidad)}</p>
                    <button
                        className="my-2 inline-block bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-700"
                        >
                        Agregar al Pedido
                    </button>
                </div>
            :   <div className="bg-red-800 px-2 py-3">
                    <p className="text-lg font-semibold my-3">Usted no tiene stock disponible para el calzado {producto.name} talla {sizeNumber}, adquiera con el franquiciante.</p>
                </div>}
        </div>
    )
}

export default DetallesProducto