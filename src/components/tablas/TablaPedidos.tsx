'use client'
import { Producto } from '@/config/interfaces'
import { formatoPrecio } from '@/utils/price'

interface TablaPedidosCompraVentaProps {
    pedidos: Producto[]
}

const TablaPedidosCompraVenta: React.FC<TablaPedidosCompraVentaProps> = ({ pedidos }) => {
    if (!pedidos || pedidos.length === 0) return null
    
    return (
        <div className="container mx-auto p-4 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">SKU</th>
                            <th className="py-3 px-6 text-center">Nombre - Talla</th>
                            <th className="py-3 px-3 text-center">Cantidad</th>
                            <th className="py-3 px-6 text-center">Precio Unitario</th>
                            <th className="py-3 px-6 text-center">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className='hover:bg-gray-100 dark:hover:bg-slate-800'>
                    {pedidos.map((producto) => {
                        return (
                            <tr className="border-b border-gray-200" key={producto.sku}>
                            <td className="py-3 px-6 text-center ">
                                <span>{producto.sku}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <span>{producto.nombre}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <span>{producto.cantidad}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <span>{formatoPrecio(producto.precio)}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <span>{formatoPrecio(producto.subtotal)}</span>
                            </td>
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TablaPedidosCompraVenta