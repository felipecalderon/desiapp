'use client'
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import storeAuth from "@/stores/store.auth"
import storeDataStore from "@/stores/store.dataStore"
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
    if (orders) return (
        <div>
            <div className='flex flex-col items-start gap-5'>
                <header className='rounded-md py-2 w-[280px]'>
                    <div>
                        <p>Fecha</p>
                    </div>
                </header>
                <div className='flex'>
                    <section className='bg-[#f5f5f5] border border-[#ccc] rounded-md'>
                        <main className='h-full'>
                            <div className='h-full flex flex-col justify-center items-center text-center gap-6 p-8'>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2">Fecha</th>
                                                <th className="border px-4 py-2">Status</th>
                                                <th className="border px-4 py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => {

                                                const fecha = getFecha(order.createdAt)
                                                return <tr className="cursor-pointer" key={order.orderID} onClick={() => route.push(`/comprar/detalle/${order.orderID}`)}>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{fecha?.fecha}</td>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{order.status}</td>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{formatoPrecio(order.total*1.19)}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </main>
                    </section>
                </div>
                S</div>
        </div>
    )
}