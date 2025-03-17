'use client'
import React, { useEffect, useState } from 'react'
import TablaProductos from './ProductTable'
import { storeProduct } from '@/stores/store.product'
import { bajarExcel } from '@/utils/toExcel'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { Producto } from '@/config/interfaces'
import InfoTotalStock from '../InfoTotalStock'

const GenerarTabla = () => {
    const { products } = storeProduct()
    const [productosOrdenados, setOrdenados] = useState<Producto[]>([])
    const [filtro, setFiltro] = useState<string>('')
    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value)
    }
    useEffect(() => {
        const productosOrdenados = [...products].sort((a: Producto, b: Producto) => {
            // Calcular la similitud con el filtro
            const similitudA = a.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0
            const similitudB = b.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0

            // calcular cantidades totales de variantes por cada producto
            const totalVariantsA = a.ProductVariations?.reduce((total, variation) => total + variation.stockQuantity, 0) || 0
            const totalVariantsB = b.ProductVariations?.reduce((total, variation) => total + variation.stockQuantity, 0) || 0

            // Ordenar de forma descendente por cantidad
            const resultado = totalVariantsB - totalVariantsA
            // Ordenar de forma descendente por similitud
            if (filtro) {
                return similitudB - similitudA
            }
            return resultado - similitudB - similitudA
        })
        setOrdenados(productosOrdenados)
    }, [filtro, products])

    const download = () => {
        products && bajarExcel(products)
    }
    return (
        <div className="container mx-auto px-10">
            <div className="mb-4 flex flex-row gap-3 items-center">
                <input
                    className="px-2 py-1 bg-blue-200 mt-3 w-1/3 border-gray-300 shadow-sm rounded-md placeholder:text-sm"
                    placeholder="Buscar producto aquí..."
                    type="text"
                    id="filtro"
                    value={filtro}
                    onChange={handleFiltroChange}
                />
                <button
                    onClick={download}
                    className="flex flex-row items-center bg-blue-700 mt-3 px-3 py-2 text-white rounded-lg h-fit hover:bg-blue-500 transition-all"
                >
                    Descargar excel <RiFileExcel2Fill className="text-2xl ml-2" />
                </button>
                <InfoTotalStock />
            </div>
            <div className="bg-white shadow-md rounded my-6">
                <TablaProductos products={productosOrdenados} />
            </div>
        </div>
    )
}

export default GenerarTabla
