'use client'
import storeVta from '@/stores/store.pedidoVta'
import { formatoPrecio } from '@/utils/price'

const TablaPedidosVentas = () => {
    const { pedidoVta } = storeVta()
    if (!pedidoVta || pedidoVta.length === 0) return null
    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">SKU</th>
                            <th className="py-3 px-6 text-center">Nombre - Talla</th>
                            <th className="py-3 px-3 text-center">Cantidad</th>
                            <th className="py-3 px-6 text-center">Precio Unitario</th>
                            <th className="py-3 px-6 text-center">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="hover:bg-gray-100">
                        {pedidoVta.map((producto) => {
                            const { priceCost, priceList, sku, stockQuantity, variationID } = producto.ProductVariations[0]
                            return (
                                <tr className="border-b border-gray-200" key={variationID}>
                                    <td className="py-3 px-6 text-center ">
                                        <span>{sku}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span>{producto.name}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span>{stockQuantity}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span>{formatoPrecio(priceCost)}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span>{formatoPrecio(priceList)}</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TablaPedidosVentas
