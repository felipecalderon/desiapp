'use client'

import { OrdendeCompra, Role } from '@/config/interfaces'
import FechaFormateada from '@/components/FechaFormat'
import HoraFormateada from '@/components/HoraFormateada'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { formatoRut } from '@/utils/rut'
import storeSales from '@/stores/store.sales'
import { formatoPrecio } from '@/utils/price'
import { useEffect, useState } from 'react'
import { fetchData } from '@/utils/fetchData'

const Header = () => {
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const { totalSales, sales, updateTotals } = storeSales()
    const [facturado, setFacturado] = useState(0)

    useEffect(() => {
        updateTotals();
    }, [sales])

    useEffect(() => {
        fetchData('order')
            .then((order: OrdendeCompra[]) => {
                const total = order.reduce((acc, {total, status}) => {
                    if(status === 'Pendiente'){
                        return acc + total
                    }
                    return acc
                }, 0)
                setFacturado(total);
            })
    }, [])
    if (!user) return null
    if (user.role === Role.Admin) {
        return (
            <div className='flex flex-row justify-between items-center w-full px-4 pt-8'>
                <div className='text-left'>
                    <h1 className='text-3xl font-semibold'>Welcome to Central D3SI AVOCCO</h1>
                    <h2 suppressHydrationWarning={true} className='text-lg font-light'>You are at D3SI AVOCCO HQ | {user.name} </h2>
                </div>
                <div>
                    <p className='italic'><FechaFormateada /> | <HoraFormateada /></p>
                    <div className='bg-blue-700 p-3 text-white rounded-lg h-fit'>
                        <h2 className='text-base font-semibold whitespace-pre'>
                            PAGO DE CLIENTES PENDIENTE: {formatoPrecio(facturado)}
                        </h2>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='flex flex-row justify-between items-center w-full px-4 pt-8'>
            <div className='text-left'>
                <h1 className='text-3xl font-semibold'>Bienvenido al portal D3SI AVOCCO</h1>
                <p>RUT: {formatoRut(store?.rut)}</p>
                <p>Tienda de {store?.location}, {store?.city}</p>
            </div>
            <div>
                <p className='italic'><FechaFormateada /> | <HoraFormateada /></p>
                <div className='bg-blue-700 p-3 text-white rounded-lg h-fit'>
                    <h2 className='text-base font-semibold whitespace-pre'>
                        VENTAS DEL MES: {formatoPrecio(totalSales)}
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default Header