'use client'
import React from 'react'
import TablaProductos from './ProductTable'
import storeProduct from '@/stores/store.product'

const GenerarTabla = () => {
    const { products } = storeProduct()
    return (
        <div className="container mx-auto px-10 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <TablaProductos products={products}/>
            </div>
        </div>
    )
}

export default GenerarTabla