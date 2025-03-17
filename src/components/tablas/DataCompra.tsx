'use client'
import { Producto, Role, Variacion } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { formatoPrecio } from '@/utils/price'
import { ChangeEvent } from 'react'

export default function DataCompra({
    message,
    products,
    cantidades,
    getStockCentralBySku,
    handleInputChange,
}: {
    message: string
    products: Producto[]
    cantidades: { [key: string]: number }
    getStockCentralBySku: (sku: string) => number
    handleInputChange: (e: ChangeEvent<HTMLInputElement>, variation: Variacion) => void
}) {
    const { user } = storeAuth()
    const { store } = storeDataStore()

    if (!products || products.length === 0)
        return (
            <tbody className="text-gray-600">
                <tr className="border-b border-gray-200">
                    <td colSpan={6} className="py-3 px-6 text-left hover:bg-gray-100">
                        {message}
                    </td>
                </tr>
            </tbody>
        )

    return (
        <tbody className="text-gray-700 text-sm font-light">
            {products.map((producto: Producto) => {
                return producto.ProductVariations?.map((variation, index) => {
                    const variationID = variation.variationID
                    const cantidad = cantidades[variationID] || 0
                    const subtotal = variation.priceCost * cantidad
                    const esPrimero = index === 0
                    return (
                        <tr
                            key={variation.variationID}
                            className={`${esPrimero ? 'border-t-4 border-t-blue-300' : 'border-t'} text-base border-gray-200 text-gray-800`}
                        >
                            {esPrimero && (
                                <>
                                    <td rowSpan={producto.ProductVariations?.length} className="py-3 px-3 text-left w-1/4 max-w-0">
                                        <div className="flex flex-col items-center">
                                            <img src={producto.image} alt={producto.name} className="w-40 h-30 object-cover" />
                                            <span className="font-medium text-center">{producto.name}</span>
                                        </div>
                                    </td>
                                </>
                            )}
                            <td className="py-3 px-2 text-center hover:bg-gray-100">{variation.sku}</td>
                            {getStockCentralBySku(variation.sku) === 0 ? (
                                <td className="py-3 px-2 text-center hover:bg-gray-100">
                                    <span className="text-red-500">{getStockCentralBySku(variation.sku)}</span>
                                </td>
                            ) : (
                                <td className="py-3 px-2 text-center hover:bg-gray-100">
                                    <span className="font-bold text-green-600">
                                        {getStockCentralBySku(variation.sku) >= 10 ? '+10' : getStockCentralBySku(variation.sku)}
                                    </span>
                                </td>
                            )}
                            <td className="py-3 px-2 text-center hover:bg-gray-100">{formatoPrecio(variation.priceCost)}</td>
                            <td className="py-3 px-2 text-center bg-blue-200">{formatoPrecio(variation.priceList)}</td>
                            {user && user.role !== Role.Tercero && store?.role !== Role.Tercero ? (
                                variation.stockQuantity === 0 ? (
                                    <td className="py-3 px-2 text-center hover:bg-gray-100">
                                        <span className="text-red-500">{variation.stockQuantity}</span>
                                    </td>
                                ) : (
                                    <td className="py-3 px-2 text-center hover:bg-gray-100">
                                        <span className="font-bold text-green-600">
                                            {variation.stockQuantity >= 10 ? '+10' : variation.stockQuantity}
                                        </span>
                                    </td>
                                )
                            ) : null}
                            <td className="py-3 px-2 text-center hover:bg-gray-100">{variation.sizeNumber}</td>
                            <td className="py-3 text-center hover:bg-gray-100">
                                <input
                                    type="text"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    max={getStockCentralBySku(variation.sku)}
                                    name={variation.sku}
                                    value={cantidades[variation.variationID] || ''}
                                    onChange={(e) => handleInputChange(e, variation)}
                                    className="text-center w-[5rem] font-bold border border-gray-400 px-1 rounded-lg py-1"
                                />
                            </td>
                            <td className="py-3 px-2 text-center hover:bg-gray-100">{formatoPrecio(subtotal)}</td>
                        </tr>
                    )
                })
            })}
        </tbody>
    )
}
