'use client'
import React from 'react'
import CrearCalzado from '@/app/settings/components/FormCalzadoNuevo'
import ActualizarCalzado from '@/app/settings/components/FormActualizarCalzado'

const ProductAdminDetail = () => {
    return (
        <>
            <CrearCalzado />
            <ActualizarCalzado />
        </>
    )
}

export default ProductAdminDetail
