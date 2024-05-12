'use client'
import { Role } from '@/config/interfaces'
import FechaFormateada from '@/components/FechaFormat'
import HoraFormateada from '@/components/HoraFormateada'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { formatoRut } from '@/utils/rut'
import storeSales from '@/stores/store.sales'
import { formatoPrecio } from '@/utils/price'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'

const Header = () => {
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const { totalSales, sales, orders } = storeSales()
    const [facturado, setFacturado] = useState(0)
    const [totalPendienteOC, setTotalPendienteOC] = useState(0)
    useEffect(() => {
        const vtasdelMes = sales.filter((vta) => {
            const saleDate = new Date(vta.createdAt);
            const nowDate = new Date()
            // Convierte la fecha de venta a mes y año para comparación
            const saleMonth = saleDate.getMonth()
            const saleYear = saleDate.getFullYear()

            const nowMonth = nowDate.getMonth()
            const nowYear = nowDate.getFullYear()

            // Verifica si el filtro de mes y año es null y ajusta el filtrado
            const isMonthMatch = saleMonth === nowMonth
            const isYearMatch = saleYear === nowYear
            // Devuelve la venta si coincide con los filtros de mes y año
            return isMonthMatch && isYearMatch;
        })

        const total = vtasdelMes.reduce((acc, { total, status, Store, type }) => {
            if (status === 'Pagado' && !type) {
                return acc + total
            }
            return acc
        }, 0)
        setFacturado(total);
    }, [sales])

    useEffect(() => {
        if (orders) {
            const pendienteOC = orders.reduce((acc, order) => {
                if (order.status !== 'Pagado') {
                    const total = Number(order.total) - Number(order.total) * Number(order.discount)
                    const totalPendiente = order.endQuote && (order.endQuote && total * 1.19 / order.endQuote) * (order.endQuote - order.startQuote)
                    return acc + totalPendiente
                }
                return acc
            }, 0)
            setTotalPendienteOC(pendienteOC)
        }
    }, [orders])

    if (!user) return null
    if (user.role === Role.Admin) {
        return (
            <div className='flex flex-row justify-between items-center w-full px-4 pt-8'>
                <div className='text-left'>
                    <h1 className='text-3xl font-semibold'>Welcome to Central D3SI AVOCCO</h1>
                    <h2 suppressHydrationWarning={true} className='text-lg font-light'>You are at D3SI AVOCCO HQ | {user.name} </h2>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='italic'><FechaFormateada /> | <HoraFormateada /></p>
                    <Button color='primary'>PAGO DE VENTAS PENDIENTE: {formatoPrecio(facturado)}</Button>
                    {totalPendienteOC !== 0 && <Button color='warning'>PAGO DE OC PENDIENTES: {formatoPrecio(totalPendienteOC)}</Button>}
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