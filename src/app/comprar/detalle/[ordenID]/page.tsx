"use client"
import { OrdendeCompra } from "@/config/interfaces"
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useEffect, useState } from "react"

export default function DetalleOrden({ params }: { params: { ordenID: string } }) {
  const [order, setOrder] = useState<OrdendeCompra | null>(null)

  useEffect(() => {
    fetchData(`order/${params.ordenID}`)
      .then((res: any) => {
        if (typeof res === 'string') console.log({ error: res })
        else setOrder(res)
      })
      .catch(e => console.log('error obteniendo orden', e))
  }, [])

  if (!order) return null
  const creacion = getFecha(order.createdAt)
  return <div className="container mx-auto my-8 p-4">
    <h2 className="text-3xl font-bold mb-4">Detalle de la O.C</h2>
    <p className="text-sm">Creación O.C: {creacion?.fecha} a las {creacion?.hora}</p>
    <p className="text-lg font-semibold">Subtotal: {formatoPrecio(order.total)}</p>
    <p className="text-lg font-semibold">IVA: {formatoPrecio(order.total * 0.19)}</p>
    <p className="text-lg font-semibold">Total: {formatoPrecio(order.total * 1.19)}</p>
    <p className={`text-lg font-semibold ${order.status === 'Pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
      Estado: {order.status}
    </p>
    <div className="border-t mt-4 pt-4">
      <p className="text-xl font-semibold mb-2">Productos:</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-blue-950">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Detalle
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Talla
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Costo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
          {
            order.ProductVariations.map(({ name, priceCost, quantityOrdered, sizeNumber, sku, subtotal }) => {
              return (
                <tr key={sku} className="hover:bg-gray-100 dark:hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {quantityOrdered} x {name} <span className="text-sm font-thin">({sku})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sizeNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatoPrecio(priceCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatoPrecio(subtotal)}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  </div>
}