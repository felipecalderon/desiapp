'use client'
import storeProduct from '@/stores/store.product'
import React from 'react'
import Image from 'next/image'
import CrearCalzado from '@/components/FormCalzadoNuevo'
import ActualizarCalzado from '@/components/FormActualizarCalzado'


const ProductAdminDetail = () => {
    return (
        <>
        <CrearCalzado />
        <ActualizarCalzado />
        </>
    )
}

export default ProductAdminDetail