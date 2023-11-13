'use client'
import SelectStore from "@/components/SelectStore"
import storeCpra from "@/stores/store.pedidCpra"
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
interface Orders {
    orderID: string
    status: string
    total: number
    createdAt: Date
}
export default function Facturacion() {
    const route = useRouter()
    const { storeID, userID } = storeCpra()
    const [orders, setOrders] = useState<Orders[] | null>(null)
    useEffect(() => {
        if (storeID && userID) {
            fetchData(`order/?storeID=${storeID}`)
                .then(res => setOrders(res))
        }
    }, [storeID])
    if (orders) return (
        <div>
            <SelectStore />
            <div className='flex flex-col items-start gap-5'>
                <header className='rounded-md py-2 w-[280px]'>
                    <div>
                        <p>Fecha</p>
                    </div>
                </header>
                <div className='flex gap-14'>
                    <section className='flex flex-col gap-4'>
                        <main className='calendar-options bg-[#f5f5f5] rounded-md w-[280px]'>
                            <div>
                                <p>ENERO</p>
                            </div>
                            <div>
                                <p>FEBRERO</p>
                            </div>
                            <div>
                                <p>MARZO</p>
                            </div>
                            <div>
                                <p>ABRIL</p>
                            </div>
                            <div>
                                <p>MAYO</p>
                            </div>
                            <div>
                                <p>JUNIO</p>
                            </div>
                            <div>
                                <p>JULIO</p>
                            </div>
                            <div>
                                <p>AGOSTO</p>
                            </div>
                            <div>
                                <p>SEPTIEMBRE</p>
                            </div>
                            <div>
                                <p className='active'>OCTUBRE</p>
                            </div>
                            <div>
                                <p>NOVIEMBRE</p>
                            </div>
                            <div>
                                <p>DICIEMBRE</p>
                            </div>
                        </main>
                    </section>
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
                                                {/* Add more headers as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => {

                                                const fecha = getFecha(order.createdAt)
                                                return <tr className="cursor-pointer" key={order.orderID} onClick={() => route.push(`/comprar/detalle/${order.orderID}`)}>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{fecha?.fecha}</td>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{order.status}</td>
                                                    <td className="border px-4 py-2 hover:bg-slate-200">{formatoPrecio(order.total*1.19)}</td>
                                                    {/* Add more cells as needed */}
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