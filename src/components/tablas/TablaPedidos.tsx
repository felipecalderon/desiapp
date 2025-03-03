'use client'
import { url } from '@/config/constants'
import { Producto } from '@/config/interfaces'
import useBarcode from '@/stores/store.barcode'
import storeDataStore from '@/stores/store.dataStore'
import storeVta from '@/stores/store.pedidoVta'
import { storeProduct } from '@/stores/store.product'
import storeSales from '@/stores/store.sales'
import { fetchData } from '@/utils/fetchData'
import { formatoPrecio } from '@/utils/price'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsFillCartPlusFill } from 'react-icons/bs'
import { CiSquareRemove } from 'react-icons/ci'

interface Products {
    storeProductID: string
    quantitySold: number
}
const TablaPedidosVenta = () => {
    const route = useRouter()
    const { pedidoVta, clearPedido } = storeVta()
    const { setSales } = storeSales()
    const { store } = storeDataStore()
    const [message, setMessage] = useState<string | null>(null)
    const [products, setProducts] = useState<Products[] | null>(null)
    const { setProduct, setProducts: setProductosTienda } = storeProduct()
    const { setValue } = useBarcode()
    const [loading, setLoading] = useState(false)
    const cargarProductos = async (storeID?: string) => {
        const endpoint = storeID ? `products/?storeId=${storeID}` : 'products'
        const productos: Producto[] = await fetchData(endpoint)
        setProductosTienda(productos)
    }

    const handleSendVta = async () => {
        try {
            setLoading(true)
            console.log(products)
            if (!store) return console.log('Falta ID para store')
            if (!products) return console.log('Faltan productos')
            const res = await fetch(`${url.backend}/sale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeID: store?.storeID,
                    products,
                }),
            })
            const data = await res.json()
            if (data) {
                const res = await fetch(`${url.backend}/sale?storeID=${store.storeID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const dataSales = await res.json()
                setSales(dataSales)
                setMessage(data.message)
                setValue('')
                setProduct(null)
                await cargarProductos(store.storeID)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (pedidoVta && pedidoVta.length > 0) {
            const transformedArray = pedidoVta?.map((item) => {
                const [variation] = item.ProductVariations
                return {
                    storeProductID: variation?.storeProductID || variation?.Stores?.[0]?.StoreProduct?.storeProductID || '',
                    quantitySold: item.cantidad,
                }
            })
            setProducts(transformedArray)
        }
    }, [pedidoVta])

    if (!pedidoVta || pedidoVta.length === 0) return null
    return (
        <div className="p-4 dark:bg-gray-800">
            {message ? (
                <div className="bg-white text-center p-4 dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                    <p className="text-center text-2xl">{message}</p>
                    <button
                        className="my-4 items-center px-5 py-5 bg-blue-500 text-white font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition ease-in-out duration-150"
                        onClick={() => {
                            route.push('/')
                            clearPedido()
                        }}
                    >
                        Aceptar
                    </button>
                </div>
            ) : (
                <div>
                    <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-center">SKU</th>
                                    <th className="py-3 px-6 text-center">Nombre - Talla</th>
                                    <th className="py-3 px-3 text-center">Cantidad</th>
                                    <th className="py-3 px-6 text-center">Precio Unitario</th>
                                    <th className="py-3 px-6 text-center">Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="hover:bg-gray-100 dark:hover:bg-slate-800">
                                {pedidoVta.map((producto) => {
                                    if (producto.ProductVariations.length === 0 || Object.keys(producto).length === 0) return null
                                    const { priceList, sizeNumber, sku, stockQuantity, variationID } = producto?.ProductVariations[0]
                                    return (
                                        <tr className="border-b border-gray-200" key={variationID}>
                                            <td className="py-3 px-6 text-center ">
                                                <span>{sku}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span>
                                                    {producto.name} - {sizeNumber}
                                                </span>
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
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    // onClick={() => removePedido(sku)}
                                                    className="text-red-600 text-3xl hover:scale-125 transition-all"
                                                >
                                                    <CiSquareRemove />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleSendVta}
                            size="lg"
                            isLoading={loading}
                            disabled={loading}
                            className="my-4 inline-flex items-center px-10 py-5 bg-blue-500 text-white font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <BsFillCartPlusFill className="mr-2 -ml-1 h-4 w-4" />
                            Generar venta
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaPedidosVenta
