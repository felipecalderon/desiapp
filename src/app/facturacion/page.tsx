'use client'
import { getFecha } from "@/utils/fecha"
import { formatoPrecio } from "@/utils/price"
import { useRouter } from 'next/navigation'
import { isCaducatedDate } from "@/utils/compareDate"
import { calcularMesVto } from "@/utils/calcularMesVencimiento"
import storeSales from "@/stores/store.sales"

export default function Facturacion() {
    const route = useRouter()
    const { orders } = storeSales()
    
    const handleClickOrder = (orderID: string) => route.push(`/comprar/detalle/${orderID}`)
    if (orders?.length === 0) return <p>No hay órdenes creadas aún</p>
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
                            <th className="border px-4 py-2">Cuota</th>
                            <th className="border px-4 py-2">Saldo Pendiente</th>
                            <th className="border px-4 py-2">Vencimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const { fecha: emision } = getFecha(order.createdAt)
                            const stringVto = (calcularMesVto(order.expiration, order.startQuote || 0));
                            const vencimiento = getFecha(stringVto)
                            const caduco = isCaducatedDate(vencimiento.fecha)
                            const cuotas = typeof order.startQuote === 'number' && typeof order.endQuote === 'number' ? `${order.startQuote} de ${order.endQuote}` : '-'
                            const pago = typeof order.startQuote === 'number' && typeof order.endQuote === 'number' ? Number(order.endQuote) !== Number(order.startQuote) : true
                            const esBodega = order.Store.isAdminStore
                            const estaCaducado = !esBodega && caduco && pago && order.status !== 'Pagado'
                            const aunNoCaduca = !esBodega && pago && order.status !== 'Pagado'
                            const total = Number(order.total) - Number(order.total) * Number(order.discount)
                            let colorFondo = ''
                            if (aunNoCaduca) colorFondo = 'bg-yellow-300 hover:bg-yellow-500'
                            if (estaCaducado) colorFondo = 'bg-red-300 hover:bg-red-500'
                            const saldoPendiente = order.endQuote && (order.endQuote && total * 1.19 / order.endQuote)*(order.endQuote - order.startQuote)
                            return <tr onClick={() => handleClickOrder(order.orderID)} className="cursor-pointer dark:bg-blue-800" key={order.orderID}>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.Store.name}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{emision}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700 text-xs">{Type(order.type)}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.status}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{formatoPrecio(total * 1.19)}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{order.dte}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{cuotas}</td>
                                <td className="border px-2 py-2 hover:bg-slate-200 dark:hover:bg-blue-700">{formatoPrecio(saldoPendiente)}</td>
                                <td className={`border px-2 py-2 ${colorFondo}`}>{vencimiento.fecha}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Type = (type: 'OCD' | 'OCC' | 'OCR' | 'OCP') => {
    if (type === "OCD") return 'Compra Directa'
    if (type === "OCR") return 'Reposición Automática'
    if (type === "OCC") return 'Compra por Consignación'
    if (type === "OCP") return 'Primera Carga'
    return 'Tipo no reconocido'
}