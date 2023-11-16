'use client'
import { url } from '@/config/constants'
import storeDataStore from '@/stores/store.dataStore'
import storeVta from '@/stores/store.pedidoVta'
import { fetchData } from '@/utils/fetchData'
import { formatoPrecio } from '@/utils/price'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsFillCartPlusFill } from 'react-icons/bs'
interface Products {
    storeProductID: string
    quantitySold: number
}
const TablaPedidosVenta = () => {
    const route = useRouter()
    const { pedidoVta } = storeVta()
    const { store } = storeDataStore()
    const [message, setMessage] = useState<string | null>(null)
    const [products, setProducts] = useState<Products[] | null>(null)
    const handleSendVta = async () => {
        if (!store) return console.log('Falta ID para store');
        if (!products) return console.log('Faltan productos');
        const res = await fetch(`${url.backend}/sale`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                storeID: store?.storeID,
                products
            })
        })
        const data = await res.json()
        if (data) setMessage(data.message)
    }

    useEffect(() => {
        const transformedArray = pedidoVta.map(item => ({
            "storeProductID": item.ProductVariations[0].storeProductID,
            "quantitySold": item.cantidad
        }));
        setProducts(transformedArray)
    }, [pedidoVta])
    if (!pedidoVta || pedidoVta.length === 0) return null
    return (
        <div className="p-4 dark:bg-gray-800">
            {
                message
                    ? <div className="bg-white text-center p-4 dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                        <p className='text-center text-2xl'>{message}</p>
                        <button className='my-4 items-center px-5 py-5 bg-blue-500 text-white font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition ease-in-out duration-150' 
                        onClick={() => route.push('/')}
                        >Aceptar</button>
                    </div>
                    : <div>
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
                                    {pedidoVta.map((producto) => {
                                        const { priceCost, priceList, sizeNumber, sku, stockQuantity, variationID } = producto.ProductVariations[0]
                                        return (
                                            <tr className="border-b border-gray-200" key={variationID}>
                                                <td className="py-3 px-6 text-center ">
                                                    <span>{sku}</span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span>{producto.name}</span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span>{producto.cantidad}</span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span>{formatoPrecio(priceList)}</span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span>{formatoPrecio(priceList * producto.cantidad)}</span>
                                                </td>
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex justify-center'>
                            <button
                                onClick={handleSendVta}
                                className="my-4 inline-flex items-center px-10 py-5 bg-blue-500 text-white font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                <BsFillCartPlusFill className="mr-2 -ml-1 h-4 w-4" />
                                Generar venta
                            </button>
                        </div>
                    </div>
            }
        </div>
            )
}

            export default TablaPedidosVenta