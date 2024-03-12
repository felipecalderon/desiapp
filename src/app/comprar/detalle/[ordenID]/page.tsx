"use client"
import { url } from "@/config/constants"
import { OrdendeCompra, ProductosdeOrden, Role } from "@/config/interfaces"
import storeAuth from "@/stores/store.auth"
import { calcularParesTotales } from "@/utils/calculateTotal"
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Input } from "@nextui-org/react";

export default function DetalleOrden({ params }: { params: { ordenID: string } }) {
  const { user } = storeAuth()
  const route = useRouter()
  const [order, setOrder] = useState<OrdendeCompra | null>(null)
  const [edit, setEdit] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductosdeOrden[]>([])
  const [totalPares, setTotalPares] = useState(0)
  const tablaRef = useRef<HTMLTableElement>(null);
  const [editOrder, setEditOrder] = useState({
    orderID: params.ordenID,
    status: 'Pendiente',
    dte: "",
    expiration: ''
  })

  const deleteOrder = async () => {
    const data = await fetch(`${url.backend}/order?orderID=${params.ordenID}`, { method: 'DELETE' })
    const res = await data.json()
    setMessage(res.message)
    route.push('/facturacion')
  }

  const imprimirTabla = () => {
    if (tablaRef.current) {
      const ventanaImpresion = window.open('', '_blank');
      if (ventanaImpresion) {
        ventanaImpresion.document.write('<html><head><title>Impresión</title>');

        // Copiar los estilos globales y de Tailwind
        Array.from(document.getElementsByTagName("link")).forEach(link => {
          if (link.rel === "stylesheet") {
            ventanaImpresion.document.write(link.outerHTML);
          }
        });

        ventanaImpresion.document.write('</head><body>');
        ventanaImpresion.document.write(tablaRef.current.outerHTML);
        ventanaImpresion.document.write('</body></html>');
        ventanaImpresion.document.close();

        // Llamar a la función de impresión
        ventanaImpresion.focus(); // Enfocar la ventana de impresión para asegurar que el diálogo se abra en ella
        ventanaImpresion.print();

        // Retrasar el cierre de la ventana de impresión
        setTimeout(() => {
          ventanaImpresion.close();
        }, 500); // Ajuste el tiempo de espera según sea necesario
      }
    }
  };

  const editOrderHandle = async () => {
    if (!edit) {
      setEdit(!edit)
    } else {
      setEdit(false)
      const formatoUpdateOrder = {
        ...editOrder, newProducts: [...products]
      }
      if (order?.status === 'Recibido') return setMessage('Productos declarados como RECIBIDOS, no se puede cambiar')

      const data = await fetch(`${url.backend}/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatoUpdateOrder)
      })
      const res = await data.json()
      setMessage(`${res.message}, recargue para ver los cambios`)
      console.log({ res });
    }
  }

  type GroupedProducts = {
    [key: string]: ProductosdeOrden[];
  };
  // Función para agrupar y ordenar los productos
  function groupAndSortProducts(products: ProductosdeOrden[]): ProductosdeOrden[] {
    const grouped = products.reduce<GroupedProducts>((acc, product) => {
      // Si el grupo aún no existe, inicialízalo
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      // Agrega el producto al grupo correspondiente
      acc[product.name].push(product);
      return acc;
    }, {});
    // Ordenar cada grupo por sizeNumber de menor a mayor y luego aplanar el resultado
    return Object.values(grouped).flatMap(group => group.sort((a, b) => Number(a.sizeNumber) - Number(b.sizeNumber)));
  }
  useEffect(() => {
    if (order) {
      const newProducts = order.ProductVariations.filter(pv =>
        !products.some(p => p.variationID === pv.variationID)
      );
      if (newProducts.length > 0) {
        const updatedProducts = [...products, ...newProducts];
        const groupedAndSorted = groupAndSortProducts(updatedProducts);
        setProducts(groupedAndSorted);
      }
    }
  }, [order]);

  useEffect(() => {
    const paresTotales = calcularParesTotales(products)
    setTotalPares(paresTotales)
  }, [order, products])

  useEffect(() => {
    fetchData(`order/${params.ordenID}`)
      .then((res: OrdendeCompra) => setOrder(res))
      .catch(e => console.log('error obteniendo orden', e))
  }, [])


  if (!order) return <p>Cargando...</p>
  const creacion = getFecha(order.createdAt)
  return <div ref={tablaRef} className="container mx-auto my-1 px-4">
    <h2 className="text-3xl font-bold my-3">Detalle de la O.C</h2>
    <p className="text-sm">Creación O.C: {creacion?.fecha} a las {creacion?.hora}</p>
    <p className="text-2xl font-semibold">{order.Store.name} - {order.Store.rut}</p>
    <p className="text-lg font-semibold">Subtotal: {formatoPrecio(order.total)}</p>
    <p className="text-lg font-semibold">IVA: {formatoPrecio(order.total * 0.19)}</p>
    {
      order.dte ? <p className="text-lg font-semibold">N° DTE: <span className="italic font-normal">{order.dte}</span></p>
      : <p className="text-lg font-semibold bg-red-300 px-2 rounded-sm w-fit">DTE Pendiente</p>
    }
    <div className="flex flex-row items-center gap-3">

      <p className={`text-lg font-semibold flex flex-row gap-3 my-3 ${order.status === 'Pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
        Estado: {!edit
          ? order.status
          : <select defaultValue={order.status} onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}>
            <option value={'Pendiente'}>Pendiente</option>
            {edit && user?.role === Role.Admin && <option value={'Pagado'}>Pagado</option>}
            {edit && user?.role === Role.Admin && <option value={'Enviado'}>Enviado</option>}
            {edit && user?.role === Role.Admin && <option value={'Facturado'}>Facturado</option>}
            <option value={'Recibido'}>Recibido conforme</option>
          </select>
        } <button onClick={editOrderHandle} className="px-6 rounded-lg bg-blue-800 text-white">{edit ? 'Confirmar' : 'Editar'}</button>
        {edit && user?.role === Role.Admin && <button onClick={deleteOrder} className="px-3 rounded-sm bg-red-800 text-white">Eliminar Orden</button>}
        {edit && user?.role === Role.Admin && <Input
          onChange={(e) => setEditOrder({ ...editOrder, dte: e.target.value })}
          type="number"
          min={0}
          color="primary"
          label="DTE"
          placeholder="Ingresar n° DTE" />
        }
      </p>
      <button onClick={imprimirTabla} className="px-3 rounded-lg h-fit bg-blue-900 text-sm py-1 text-white">Imprimir</button>
    </div>
    {message && <p className="bg-green-800 px-3 py-2 w-fit mt-2 rounded-md text-white">{message}</p>}
    <div className="mt-2">
      <p className="text-xl font-semibold mb-2">Productos:</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-blue-950">
          <tr>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Detalle
            </th>
            <th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Talla
            </th>
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Costo
            </th>
            <th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Cantidad
            </th>
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
          {
            products.map(({ name, priceCost, quantityOrdered, sizeNumber, sku, subtotal }, i) => {
              // Comparar el nombre actual con el nombre de la fila anterior
              let isDifferentGroup = i === 0 || name !== products[i - 1].name;
              const barra = isDifferentGroup && 'border-t-2'
              return (
                <tr key={sku} className={`hover:bg-gray-100 dark:hover:bg-blue-700`}>
                  <td className={`px-0 py-2 text-center whitespace-nowrap`}>
                    {i + 1}
                  </td>
                  <td className={`flex flex-row justify-between px-2 py-2 ${barra}`}>
                    <div>
                      {name} <span className="text-sm font-thin">({sku})</span>
                    </div>
                  </td>
                  <td className="px-0 py-2 text-center whitespace-nowrap">
                    {sizeNumber}
                  </td>
                  <td className="px-2 py-2 text-center  whitespace-nowrap">
                    {formatoPrecio(priceCost)}
                  </td>
                  <td className="px-0 py-2 text-center whitespace-nowrap">
                    {quantityOrdered}
                  </td>
                  <td className="px-2 py-2 text-center  whitespace-nowrap">
                    {formatoPrecio(subtotal)}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <p className="text-lg font-semibold text-right">Subtotal: {formatoPrecio(order.total)}</p>
      <p className="text-lg font-semibold text-right">IVA: {formatoPrecio(order.total * 0.19)}</p>
      <p className="text-lg font-semibold text-right">Total: {formatoPrecio(order.total * 1.19)} </p>
      <p className="text-lg font-semibold text-right">Total Pares: {totalPares}</p>
    </div>
  </div>
}