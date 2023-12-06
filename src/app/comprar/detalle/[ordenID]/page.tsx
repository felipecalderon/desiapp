"use client"
import { url } from "@/config/constants"
import { OrdendeCompra, ProductosdeOrden, Role } from "@/config/interfaces"
import storeAuth from "@/stores/store.auth"
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BiSolidEdit } from "react-icons/bi";


export default function DetalleOrden({ params }: { params: { ordenID: string } }) {
  const {user} = storeAuth()
  const route = useRouter()
  const [order, setOrder] = useState<OrdendeCompra | null>(null)
  const [edit, setEdit] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductosdeOrden[]>([])
  const [editOrder, setEditOrder] = useState({
    orderID: params.ordenID,
    status: 'Pendiente'
  })

  const deleteOrder = async () => {
    const data = await fetch(`${url.backend}/order?orderID=${params.ordenID}`, { method: 'DELETE' })
    const res = await data.json()
    setMessage(res.message)
    route.push('/facturacion')
  }

  const editOrderHandle = async () => {
    if(!edit){
      setEdit(!edit)
    }else{
      setEdit(false)
      const formatoUpdateOrder = {
        ...editOrder, newProducts: [...products]
      }
      if(order?.status === 'Recibido') return setMessage('Productos declarados como RECIBIDOS, no se puede cambiar')
      if(order?.status === editOrder.status) return setMessage('No hay cambios para realizar')
      const data = await fetch(`${url.backend}/order`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatoUpdateOrder)
      })
      const res = await data.json()
      setMessage(`${res.message}, recargue para ver los cambios`)
      console.log({res});
    }
  }

  useEffect(() => {
    if(order) {
      setProducts(prevProducts => {
        // Crear un mapa de IDs de productos existentes para una verificación rápida
        const existingProductIds = new Set(prevProducts.map(p => p.variationID));
  
        // Filtrar los productos que ya están presentes
        const newProducts = order.ProductVariations.filter(product => !existingProductIds.has(product.variationID));

        // Agregar solo los nuevos productos
        return [...prevProducts, ...newProducts.map(product => ({ ...product }))];
      });
    }
  }, [order]);

  useEffect(() => {
    fetchData(`order/${params.ordenID}`)
      .then((res: OrdendeCompra) => setOrder(res))
      .catch(e => console.log('error obteniendo orden', e))
  }, [])

  if (!order) return <p>Orden no encontrada</p>
  const creacion = getFecha(order.createdAt)
  return <div className="container mx-auto my-8 p-4">
    <h2 className="text-3xl font-bold mb-4">Detalle de la O.C</h2>
    <p className="text-sm">Creación O.C: {creacion?.fecha} a las {creacion?.hora}</p>
    <p className="text-lg font-semibold">Subtotal: {formatoPrecio(order.total)}</p>
    <p className="text-lg font-semibold">IVA: {formatoPrecio(order.total * 0.19)}</p>
    <p className="text-lg font-semibold">Total: {formatoPrecio(order.total * 1.19)}</p>
    <p className={`text-lg font-semibold flex flex-row gap-3 ${order.status === 'Pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
      Estado: {!edit
        ? order.status
        : <select onChange={(e) => setEditOrder({...editOrder, status: e.target.value})}>
          <option value={'Pendiente'}>Pendiente</option>
          {edit && user?.role===Role.Admin && <option value={'Pagado'}>Pagado</option>}
          <option value={'Recibido'}>Recibido conforme  </option>
        </select>
      } <button onClick={editOrderHandle} className="px-3 rounded-sm bg-blue-800 text-white">{edit ? 'Confirmar' : 'Editar'}</button>
      {edit && user?.role===Role.Admin && <button onClick={deleteOrder} className="px-3 rounded-sm bg-red-800 text-white">Eliminar Orden</button>}
    </p>
    {message && <p className="bg-green-800 px-3 py-2 w-fit mt-2 rounded-md text-white">{message}</p>}
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
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Cantidad
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
                  <td className="flex flex-row justify-between px-6 py-4">
                    <div>
                      {name} <span className="text-sm font-thin">({sku})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sizeNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatoPrecio(priceCost)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {quantityOrdered}
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