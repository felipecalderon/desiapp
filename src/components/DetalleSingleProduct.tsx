'use client'

import { Producto } from "@/config/interfaces"
import storeVta from "@/stores/store.pedidoVta"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"

function DetallesProducto({ product }: { product: Producto }) {
    const [cantidad, setCantidad] = useState(1)
    const { pedidoVta, setPedido, clearPedido, removePedido, updateCantidad } = storeVta()
    const { priceList, sizeNumber, sku, stockQuantity } = product.ProductVariations[0]

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se pasa el evento a un numero para poder hacer cálculo despues
        const nuevaCantidad = parseInt(e.target.value, 10)
        if (!isNaN(nuevaCantidad)) {
            setCantidad(nuevaCantidad)
        }
    }

    const handleAgregarAlPedido = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // 1. Clonar el producto para evitar mutaciones directas
        const productoClonado = { ...product };

        // 2. Crear un nuevo objeto de variación con la cantidad actualizada
        const variacionActualizada = {
            ...productoClonado.ProductVariations[0],
            stockQuantity: cantidad,
        };

        // 3. Actualizar la variación del producto clonado
        productoClonado.ProductVariations = [variacionActualizada];

        // 4. Verificar si el producto ya está en el pedido
        const productoEnPedido = pedidoVta.find(({ ProductVariations }) =>
            ProductVariations?.some(({ sku: skuVar }) => skuVar === variacionActualizada.sku)
        );

        // 5. Si la cantidad es 0 y el producto ya está en el pedido, quitarlo del pedido
        if (cantidad === 0 && productoEnPedido) {
            removePedido(variacionActualizada.sku);
        }

        // 6. Si la cantidad no es 0 y el producto ya está en el pedido, actualizar la cantidad
        else if (cantidad !== 0 && productoEnPedido) {
            updateCantidad(variacionActualizada.sku, cantidad);
        }

        // 7. Si el producto no está en el pedido y la cantidad no es 0, agregarlo al pedido
        else if (cantidad !== 0) {
            setPedido(productoClonado);
        }
    }
    useEffect(() => {
        updateCantidad(sku, cantidad);
        //cuando el componente se desmonta se limpia el pedido
        return () => {
            clearPedido()
        }
    }, [cantidad])
    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 bg-red-600 flex flex-col justify-center items-center p-1">
                    <span className="text-xs mb-1">Talla</span>
                    <span className="text-lg font-bold">{sizeNumber}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            </div>
            <ul className="list-disc list-inside">
                <li>SKU: {sku}</li>
                <li>Precio Venta: {formatoPrecio(priceList)}</li>
                <li>Stock: {stockQuantity}</li>
            </ul>
            <hr className='opacity-20 my-1' />
            {Number(stockQuantity) !== 0 ? <form onSubmit={(e) => handleAgregarAlPedido(e)}>
                <p className='dark:text-white text-gray-900'>Ingrese la cantidad a vender</p>
                <input
                    type="number"
                    value={cantidad}
                    min={0}
                    max={stockQuantity}
                    onChange={(e) => handleCantidadChange(e)}
                    className="w-full p-2 rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                    placeholder="Ingresa la cantidad"
                />
                <p className='dark:text-white text-gray-900 py-2'>Subtotal: {formatoPrecio(Number(priceList) * cantidad)}</p>
                <button
                    className="my-2 inline-block bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-700"
                    type="submit"
                >
                    Agregar al Pedido
                </button>
            </form>
                : <div className="bg-red-800 px-2 py-3">
                    <p className="text-lg font-semibold my-3">Usted no tiene stock disponible para el calzado {product.name} talla {sizeNumber}, adquiera con el franquiciante.</p>
                </div>}
        </div>
    )
}

export default DetallesProducto