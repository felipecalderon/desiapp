'use client'
import React from 'react'
import TablaProductos from './ProductTable'
import storeProduct from '@/stores/store.product'
import { bajarExcel } from '@/utils/toExcel'

const GenerarTabla = () => {
    const { products } = storeProduct()
    const download = () => {
        products && bajarExcel(products)
    }
    return (
        <div className="container mx-auto px-10 dark:bg-gray-800">
            <button onClick={download} className="bg-blue-700 mt-3 px-3 py-2 text-white rounded-lg h-fit hover:bg-blue-500 transition-all">Descargar excel</button>
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <TablaProductos products={products}/>
            </div>
        </div>
    )
}

export default GenerarTabla