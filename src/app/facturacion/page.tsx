'use client'
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import storeAuth from "@/stores/store.auth"
import storeDataStore from "@/stores/store.dataStore"
import { OrdendeCompra, Role } from "@/config/interfaces"

export default function Facturacion() {
    const route = useRouter()
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const [orders, setOrders] = useState<OrdendeCompra[] | null>(null)
    useEffect(() => {
        if (store) {
            fetchData(`order/?storeID=${store.storeID}`)
                .then(res => setOrders(res))
        }else if(user?.role === Role.Admin){
            fetchData('order')
                .then(res => setOrders(res))
        }
    }, [store, user])
    const handleClickOrder = (orderID: string) => route.push(`/comprar/detalle/${orderID}`)
    if(orders?.length === 0) return <p>No hay órdenes creadas aún</p>
    if (orders) return (
        <div className='flex flex-col justify-start items-center text-center gap-6 px-8 pt-10'>
            <div className="overflow-x-auto">
                <table className="table-auto">
                    <thead>
                        <tr className="dark:bg-blue-950">
                            <th className="border px-4 py-2">Sucursal</th>
                            <th className="border px-4 py-2">Emisión</th>
                            <th className="border px-4 py-2">Tipo OC</th>
                            <th className="border px-4 py-2">Estado</th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">N° DTE</th>
                            <th className="border px-4 py-2">Vencimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const { fecha: emision } = getFecha(order.createdAt)
                            const { fecha: vencimiento } = order.expiration ? getFecha(order.expiration) : { fecha: '' }

                            return <tr onClick={() => handleClickOrder(order.orderID)} className="cursor-pointer dark:bg-blue-800" key={order.orderID}>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.Store.name}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{emision}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700 text-xs">{Type(order.type)}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.status}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{formatoPrecio(order.total * 1.19)}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.dte}</td>
                                <td className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{vencimiento}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Type = (type: 'OCD' | 'OCC' | 'OCR' | 'OCP') => {
    if(type === "OCD") return 'Compra Directa'
    if(type === "OCR") return 'Reposición Automática'
    if(type === "OCC") return 'Compra por Consignación'
    if(type === "OCP") return 'Primera Carga'
    return 'Tipo no reconocido'
}