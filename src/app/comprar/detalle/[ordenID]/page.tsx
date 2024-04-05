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
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import CardDataSale from "@/components/CardDataSale"
import { FaShop, FaCashRegister } from "react-icons/fa6";
import storeCpra from "@/stores/store.pedidCpra"

export default function DetalleOrden({ params }: { params: { ordenID: string } }) {
  const route = useRouter()
  const { productos, setPedido, updateCantidad, removePedido, cantidades, setCantidades } = storeCpra()
  const [order, setOrder] = useState<OrdendeCompra | null>(null)
  const [edit, setEdit] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductosdeOrden[]>([])
  const [totalPares, setTotalPares] = useState(0)
  const tablaRef = useRef<HTMLTableElement>(null);
  const [editOrder, setEditOrder] = useState<Partial<OrdendeCompra>>({
    orderID: params.ordenID,
    status: 'Pendiente',
    dte: "",
    expiration: "",
    type: "OCD"
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
    setEdit(!edit)
    if (edit) {
      const formatoUpdateOrder = {
        ...editOrder, newProducts: [...products]
      }
      const data = await fetch(`${url.backend}/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatoUpdateOrder)
      })
      const res = await data.json()
      fetchData(`order/${params.ordenID}`)
        .then((res: OrdendeCompra) => setOrder(res))
      setMessage(`${res.message}`)
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
      if (!acc[product.Product.name]) {
        acc[product.Product.name] = [];
      }
      // Agrega el producto al grupo correspondiente
      acc[product.Product.name].push(product);
      return acc;
    }, {});
    // Ordenar cada grupo por sizeNumber de menor a mayor y luego aplanar el resultado
    return Object.values(grouped).flatMap(group => group.sort((a, b) => Number(a.sizeNumber) - Number(b.sizeNumber)));
  }

  useEffect(() => {
    if (order) {
      let dateValue = new Date();
      dateValue.setUTCHours(12, 0, 0, 0);

      setEditOrder({
        ...editOrder,
        dte: order.dte || "",
        status: order.status,
        expiration: order.expiration || dateValue.toISOString(),
        type: order.type
      })

      const newProducts = order?.ProductVariations?.filter(pv =>
        !products.some(p => p.variationID === pv.variationID)
      );
      if (newProducts && newProducts.length > 0) {
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
  const expiracion = order.expiration ? new Date(order.expiration) : new Date()
  const { fecha } = getFecha(expiracion)
  const [dia, mes, anio] = fecha.split('-')
  const inputFecha = `${anio}-${mes}-${dia}`
  return <div ref={tablaRef} className="mx-auto my-1 px-4">
    <h2 className="text-3xl font-bold my-3 text-blue-800">Detalle de la O.C</h2>
    <p className="text-sm">Emitida el: {creacion?.fecha} a las {creacion?.hora}</p>
    <p className="text-sm">{totalPares} pares solicitados.</p>
    <div className="flex flex-row gap-3 mt-3">
      <CardDataSale
        icon={FaShop}
        title='Tienda asociada'
      >
        <p className="text-sm">{order.Store.name}</p>
        <p className="text-sm">RUT: {order.Store.rut}</p>
        <p className="text-sm">{order.Store.email}</p>
      </CardDataSale>
      <CardDataSale
        icon={FaCashRegister}
        title='Desglose totales'
      >
        <p className="text-sm">Neto: {formatoPrecio(order.total)}</p>
        <p className="text-sm">IVA: {formatoPrecio(order.total * 0.19)}</p>
        <p className="text-sm">Total: {formatoPrecio(order.total * 1.19)} </p>
      </CardDataSale>
    </div>
    <div className="flex flex-row justify-between my-3 gap-3">
      <Select
        selectedKeys={[editOrder.status as string]}
        onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
        variant="flat"
        color="primary"
        label="Estado del Pago"
      >
        <SelectItem key={'Pendiente'} value={'Pendiente'}>Pendiente</SelectItem>
        <SelectItem key={'Enviado'} value={'Enviado'}>Enviado</SelectItem>
        <SelectItem key={'Pagado'} value={'Pagado'}>Pagado</SelectItem>
      </Select>

      <Select
        name="accion"
        variant="flat"
        color="primary"
        label="Naturaleza"
        selectedKeys={[editOrder.type as string]}
        onChange={(e) => {
          const validTypes = ["OCD", "OCC", "OCR", "OCP"] as const;
          const newValue = e.target.value as typeof validTypes[number];
          if (validTypes.includes(newValue)) {
            setEditOrder({ ...editOrder, type: newValue });
          } else {
            setEditOrder({ ...editOrder, type: 'OCD' })
          }
        }}
      >
        <SelectItem key="OCD" value="OCD">Compra Directa</SelectItem>
        <SelectItem key="OCR" value="OCR">Reposición Automática</SelectItem>
        <SelectItem key="OCC" value="OCC">Compra por Consignación</SelectItem>
        <SelectItem key="OCP" value="OCP">Primera Carga</SelectItem>
      </Select>
      <Input
        onChange={(e) => setEditOrder({ ...editOrder, dte: e.target.value })}
        type="number"
        min={0}
        color="primary"
        label="DTE"
        defaultValue={order.dte}
        placeholder="Ingresar n° DTE" />
      <Input
        onChange={(e) => {
          // Crear un objeto Date a partir del valor seleccionado
          try {
            let dateValue = new Date(e.target.value);
            dateValue.setUTCHours(12, 0, 0, 0);
            const fechaFormato = dateValue.toISOString()
            setEditOrder({ ...editOrder, expiration: fechaFormato });
          } catch (error) {
            setEditOrder({ ...editOrder, expiration: undefined });
          }
        }}
        type="date"
        color="primary"
        label="Vencimiento OC"
        defaultValue={inputFecha}
        className="text-xs"
      />
    </div>
    <div className="flex flex-row justify-between mb-3 gap-3">
      <Button onClick={imprimirTabla} variant="solid" color="warning">Imprimir</Button>
      <Button onClick={editOrderHandle} variant="solid" color="success">Guardar Orden</Button>
      <Button onClick={deleteOrder} variant="solid" color="danger">Eliminar OC</Button>
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
            products.map(({ priceCost, sizeNumber, sku, OrderProduct, Product }, i) => {
              // Comparar el nombre actual con el nombre de la fila anterior
              let isDifferentGroup = i === 0 || Product.name !== products[i - 1].Product.name;
              const barra = isDifferentGroup && 'border-t-2 border-blue-300'
              return (
                <tr key={sku} className={`hover:bg-gray-100 dark:hover:bg-blue-700`}>
                  <td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
                    {i + 1}
                  </td>
                  <td className={`${barra} px-2 py-2 text-left whitespace-nowrap`}>
                    <span className="text-sm font-thin">({sku})</span> {Product.name}
                  </td>
                  <td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
                    {sizeNumber}
                  </td>
                  <td className={`${barra} px-2 py-2 text-center  whitespace-nowrap`}>
                    {formatoPrecio(priceCost)}
                  </td>
                  <td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
                    {OrderProduct.quantityOrdered}
                  </td>
                  <td className={`${barra} px-2 py-2 text-center  whitespace-nowrap`}>
                    {formatoPrecio(OrderProduct.subtotal)}
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