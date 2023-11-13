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
      {order.ProductVariations.map(({ name, priceCost, quantityOrdered, sizeNumber, sku, subtotal }) => (
        <div key={sku} className="mb-4 mt-2 border-b pb-3">
          <p className="text-lg font-medium">{quantityOrdered} x {name} <span className="text-sm font-thin">({sku})</span></p>
          <p>Talla: {sizeNumber}</p>
          <p>Costo: {formatoPrecio(priceCost)}</p>
          <p>Subtotal: {formatoPrecio(subtotal)}</p>
        </div>
      ))}
    </div>
  </div>
}