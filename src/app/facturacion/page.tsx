'use client'
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import storeAuth from "@/stores/store.auth"
import storeDataStore from "@/stores/store.dataStore"
import UploadComponent from "@/components/UploadDrag"
import { Role } from "@/config/interfaces"
interface Orders {
    orderID: string
    status: string
    total: number
    createdAt: Date
}
export default function Facturacion() {
    const route = useRouter()
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const [orders, setOrders] = useState<Orders[] | null>(null)
    useEffect(() => {
        if (store && user) {
            fetchData(`order/?storeID=${store.storeID}`)
                .then(res => setOrders(res))
        }
    }, [store])
    if(orders?.length === 0) return <p>No hay órdenes creadas aún</p>
    if (orders) return (
        <div className='flex flex-col justify-start items-center text-center gap-6 px-8 pt-10'>
            <div className="overflow-x-auto">
                <table className="table-auto">
                    <thead>
                        <tr className="dark:bg-blue-950">
                            <th className="border px-4 py-2">Fecha</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {

                            const fecha = getFecha(order.createdAt)
                            return <tr className="cursor-pointer dark:bg-blue-800" key={order.orderID}>
                                <td onClick={() => route.push(`/comprar/detalle/${order.orderID}`)} className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{fecha?.fecha}</td>
                                <td onClick={() => route.push(`/comprar/detalle/${order.orderID}`)} className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.status}</td>
                                <td onClick={() => route.push(`/comprar/detalle/${order.orderID}`)} className="border px-4 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{formatoPrecio(order.total * 1.19)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}