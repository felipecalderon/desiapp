'use client'
import { url } from '@/config/constants'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import storeCpra from '@/stores/store.pedidCpra'
import { storeProduct } from '@/stores/store.product'
import { formatoPrecio } from '@/utils/price'
import { Button, Input, Select, SelectItem } from "@heroui/react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DetalleCompra = () => {
    const { productos, totalProductos, totalNeto } = storeCpra()
    console.log({ totalNeto })
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const { products } = storeProduct()
    const route = useRouter()
    const [isLoading, setLoading] = useState(false)
    const generarOC = async () => {
        try {
            setLoading(true)
            if (!store || !user) throw 'Faltan datos para hacer OC'
            const res = await fetch(`${url.backend}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeID: store.storeID,
                    userID: user.userID,
                    products: productos,
                }),
            })
            const data = await res.json()
            if (data.orderID) route.push(`/comprar/detalle/${data.orderID}`)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    if (!products || !productos) return null

    return (
        <>
            {' '}
            <h2 className="text-xl my-3 font-bold">Resumen de su orden de compra</h2>
            {/*
            <div>
                <Select defaultSelectedKeys={'OCD'} onSelect={(e) => e.currentTarget.value}>
                    "OCD" | "OCC" | "OCR" | "OCP" | "ORE" 
                    <SelectItem key='OCD' value={'OCD'}>Orden de compra directa</SelectItem>
                    <SelectItem key='ORE' value={'ORE'}>Orden de reversa de stock</SelectItem>
                </Select>
            </div>
        */}
            <div className="flex flex-col gap-5 text-base my-3">
                <div className="flex gap-2 justify-between">
                    <h6 className="font-medium text-right">Total de productos:</h6>
                    <p className="font-medium text-end tracking-wider">{totalProductos} pares</p>
                </div>
                <ul className="flex flex-col items-end text-base">
                    <li className="flex w-full justify-between">
                        <h6 className="font-medium">Total Neto:</h6>
                        <p className="font-medium text-end tracking-wider">{formatoPrecio(totalNeto)}</p>
                    </li>
                    <li className="flex w-full justify-between">
                        <h6 className="font-medium">IVA:</h6>
                        <p className="font-medium text-end tracking-wider">{formatoPrecio(totalNeto * 0.19)}</p>
                    </li>
                    <li className="flex w-full justify-between">
                        <h6 className="font-medium">Total:</h6>
                        <p className="font-medium text-end tracking-wider">{formatoPrecio(totalNeto * 1.19)}</p>
                    </li>
                </ul>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Detalle
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Talla
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Costo neto
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productos.map(({ variationID, quantityOrdered }) => {
                            // Buscar el producto que contiene la variación con el variationID
                            const productoConVariacion = products.find((producto) =>
                                producto.ProductVariations.some((variacion) => variacion.variationID === variationID)
                            )

                            // Verificar si se encontró el producto
                            if (!productoConVariacion) return null
                            const variacionEncontrada = productoConVariacion.ProductVariations.find(
                                (variacion) => variacion.variationID === variationID
                            )

                            if (!variacionEncontrada) return null

                            return (
                                <tr key={variationID}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {quantityOrdered} x {productoConVariacion.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Talla {variacionEncontrada.sizeNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatoPrecio(variacionEncontrada.priceCost)}</div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row justify-center gap-3 py-4">
                <Link href="/comprar/">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300">
                        {'<'} Volver y cambiar pedido
                    </button>
                </Link>
                <Button
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={generarOC}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Generar orden de compra
                </Button>
            </div>
        </>
    )
}

export default DetalleCompra
