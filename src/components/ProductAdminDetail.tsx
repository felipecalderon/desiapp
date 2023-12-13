'use client'
import storeProduct from '@/stores/store.product'
import React from 'react'
import Image from 'next/image'
import CrearCalzado from './FormCalzadoNuevo'


const ProductAdminDetail = () => {
    const { product } = storeProduct()
    if (!product) return (
        <>
            <p>Escanee el código de barras en la caja del calzado D3SI</p>
            <CrearCalzado />
        </>
    )
    const { image, name } = product
    return (
        <>
        <CrearCalzado />
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md w-full flex flex-row">
            <Image src={image} alt={name || 'Producto'} width={300} height={300} className="rounded-md object-cover" />
        </div>
        </>
    )
}

export default ProductAdminDetail